import { createLoggedHandler } from "./safe_handle";
import log from "electron-log";
import { db } from "../../db";
import { apps } from "../../db/schema";
import { eq } from "drizzle-orm";
import { getDyadAppPath } from "../../paths/paths";
import fs from "node:fs";
import path from "node:path";
import { simpleSpawn } from "../utils/simpleSpawn";
import { IS_TEST_BUILD } from "../utils/test_utils";

const logger = log.scope("capacitor_handlers");
const handle = createLoggedHandler(logger);

async function getApp(appId: number) {
  const app = await db.query.apps.findFirst({
    where: eq(apps.id, appId),
  });
  if (!app) {
    throw new Error(`App with id ${appId} not found`);
  }
  return app;
}

function isCapacitorInstalled(appPath: string): boolean {
  const capacitorConfigJs = path.join(appPath, "capacitor.config.js");
  const capacitorConfigTs = path.join(appPath, "capacitor.config.ts");
  const capacitorConfigJson = path.join(appPath, "capacitor.config.json");

  return (
    fs.existsSync(capacitorConfigJs) ||
    fs.existsSync(capacitorConfigTs) ||
    fs.existsSync(capacitorConfigJson)
  );
}

export function registerCapacitorHandlers() {
  handle(
    "is-capacitor",
    async (_, { appId }: { appId: number }): Promise<boolean> => {
      const app = await getApp(appId);
      const appPath = getDyadAppPath(app.path);

      // check for the required Node.js version before running any commands
      const currentNodeVersion = process.version;
      const majorVersion = parseInt(
        currentNodeVersion.slice(1).split(".")[0],
        10,
      );

      if (majorVersion < 20) {
        // version is too old? stop and throw a clear error
        throw new Error(
          `Capacitor requires Node.js v20 or higher, but you are using ${currentNodeVersion}. Please upgrade your Node.js and try again.`,
        );
      }
      return isCapacitorInstalled(appPath);
    },
  );

  handle(
    "sync-capacitor",
    async (_, { appId }: { appId: number }): Promise<void> => {
      const app = await getApp(appId);
      const appPath = getDyadAppPath(app.path);

      if (!isCapacitorInstalled(appPath)) {
        throw new Error("Capacitor is not installed in this app");
      }

      await simpleSpawn({
        command: "npm run build",
        cwd: appPath,
        successMessage: "App built successfully",
        errorPrefix: "Failed to build app",
      });

      await simpleSpawn({
        command: "npx cap sync",
        cwd: appPath,
        successMessage: "Capacitor sync completed successfully",
        errorPrefix: "Failed to sync Capacitor",
        env: {
          ...process.env,
          LANG: "en_US.UTF-8",
        },
      });
    },
  );

  handle("open-ios", async (_, { appId }: { appId: number }): Promise<void> => {
    const app = await getApp(appId);
    const appPath = getDyadAppPath(app.path);

    if (!isCapacitorInstalled(appPath)) {
      throw new Error("Capacitor is not installed in this app");
    }

    if (IS_TEST_BUILD) {
      // In test mode, just log the action instead of actually opening Xcode
      logger.info("Test mode: Simulating opening iOS project in Xcode");
      return;
    }

    await simpleSpawn({
      command: "npx cap open ios",
      cwd: appPath,
      successMessage: "iOS project opened successfully",
      errorPrefix: "Failed to open iOS project",
    });
  });

  handle(
    "open-android",
    async (_, { appId }: { appId: number }): Promise<void> => {
      const app = await getApp(appId);
      const appPath = getDyadAppPath(app.path);

      if (!isCapacitorInstalled(appPath)) {
        throw new Error("Capacitor is not installed in this app");
      }

      if (IS_TEST_BUILD) {
        // In test mode, just log the action instead of actually opening Android Studio
        logger.info(
          "Test mode: Simulating opening Android project in Android Studio",
        );
        return;
      }

      await simpleSpawn({
        command: "npx cap open android",
        cwd: appPath,
        successMessage: "Android project opened successfully",
        errorPrefix: "Failed to open Android project",
      });
    },
  );

  // Build a debug APK for Android via Gradle
  handle(
    "build-apk",
    async (
      _,
      { appId }: { appId: number },
    ): Promise<string> => {
      const app = await getApp(appId);
      const appPath = getDyadAppPath(app.path);

      if (!isCapacitorInstalled(appPath)) {
        throw new Error("Capacitor is not installed in this app");
      }

      if (IS_TEST_BUILD) {
        // Simulate APK build success in tests
        const simulatedApk = path.join(
          appPath,
          "android",
          "app",
          "build",
          "outputs",
          "apk",
          "debug",
          "app-debug.apk",
        );
        logger.info("Test mode: Simulating APK build at", simulatedApk);
        return simulatedApk;
      }

      // Ensure web assets are built and Capacitor is in sync with Android
      await simpleSpawn({
        command: "npm run build",
        cwd: appPath,
        successMessage: "App built successfully",
        errorPrefix: "Failed to build app",
      });

      await simpleSpawn({
        command: "npx cap sync android",
        cwd: appPath,
        successMessage: "Capacitor Android sync completed successfully",
        errorPrefix: "Failed to sync Capacitor for Android",
        env: { ...process.env, LANG: "en_US.UTF-8" },
      });

      // Now invoke Gradle to assemble a debug APK
      const androidDir = path.join(appPath, "android");
      const isWindows = process.platform === "win32";
      const gradleCmd = isWindows ? "gradlew.bat assembleDebug" : "./gradlew assembleDebug";

      await simpleSpawn({
        command: gradleCmd,
        cwd: androidDir,
        successMessage: "Gradle build (assembleDebug) completed successfully",
        errorPrefix: "Failed to run Gradle build",
      });

      const apkPath = path.join(
        androidDir,
        "app",
        "build",
        "outputs",
        "apk",
        "debug",
        "app-debug.apk",
      );

      if (!fs.existsSync(apkPath)) {
        throw new Error(
          `APK build completed but output file not found at: ${apkPath}. Please open Android Studio to review build settings.`,
        );
      }

      logger.info("APK built at:", apkPath);
      return apkPath;
    },
  );
}
