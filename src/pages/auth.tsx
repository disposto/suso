import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Github, Globe } from "lucide-react";
import { IpcClient } from "@/ipc/ipc_client";
import { isElectron } from "@/lib/supabase";

export default function AuthPage() {
  const { signInWithEmail, signUpWithEmail, signInWithOAuth } = useSupabaseAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [emailOrUser, setEmailOrUser] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "login") {
        const input = emailOrUser.trim();
        const isEmail = input.includes("@");
        let resolvedEmail = input;
        if (!isEmail) {
          if (isElectron()) {
            const rows = await IpcClient.getInstance().listAccounts();
            const found = rows.find(
              (r) => r.provider === "supabase" && (r.name || "").trim().toLowerCase() === input.toLowerCase(),
            );
            if (!found?.email) {
              throw new Error("Usuário não encontrado. Registre-se primeiro ou entre com e-mail.");
            }
            resolvedEmail = found.email;
          } else {
            throw new Error("No preview web, entre usando e-mail.");
          }
        }
        await signInWithEmail(resolvedEmail, password);
      } else {
        const em = emailOrUser.trim();
        const uname = username.trim();
        if (!em || !em.includes("@")) {
          throw new Error("Informe um e-mail válido para registrar.");
        }
        if (!uname || uname.length < 2 || uname.length > 32) {
          throw new Error("Usuário deve ter entre 2 e 32 caracteres.");
        }
        if (!/^[A-Za-z0-9_-]+$/.test(uname)) {
          throw new Error("Usuário deve conter apenas letras, números, '_' ou '-'.");
        }
        await signUpWithEmail(em, password);
        if (isElectron()) {
          await IpcClient.getInstance().upsertAccount({
            provider: "supabase",
            email: em,
            name: uname,
            isActive: true,
          });
          const rows = await IpcClient.getInstance().listAccounts();
          const match = rows.find((r) => r.provider === "supabase" && r.email === em);
          if (match?.id) {
            await IpcClient.getInstance().setActiveAccount({ id: match.id });
          }
        }
        // After sign up, Supabase sends a confirmation email.
        // Inform the user to check their inbox (and spam folder).
        setInfo(
          "Enviamos um e-mail de confirmação. Verifique sua caixa de entrada e também a pasta de spam. Após confirmar, volte ao app e faça login."
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 text-center">
          <h1 className="text-xl font-semibold">
            {mode === "login" ? "Entrar" : "Criar conta"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {mode === "login"
              ? "Use seu e-mail OU usuário (apenas no app) e senha"
              : "Registre-se com e-mail, usuário (apenas no app) e senha"}
          </p>
        </div>

        {/* Social login */}
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => signInWithOAuth("github")}
          >
            <Github className="h-4 w-4" />
            Continuar com GitHub
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => signInWithOAuth("google")}
          >
            <Globe className="h-4 w-4" />
            Continuar com Google
          </Button>
        </div>

        <div className="my-4 text-center text-xs text-muted-foreground">ou</div>

        <form onSubmit={submit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm">{mode === "login" ? "E-mail ou usuário" : "E-mail"}</label>
            <Input
              type={mode === "login" ? "text" : "email"}
              value={emailOrUser}
              onChange={(e) => setEmailOrUser(e.target.value)}
              placeholder={mode === "login" ? "voce@exemplo.com ou seu_usuario" : "voce@exemplo.com"}
              required
            />
          </div>
          {mode === "register" && (
            <div className="space-y-1">
              <label className="text-sm">Usuário (apenas no app)</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: carlos"
                required
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-sm">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm" role="alert">
              {error}
            </div>
          )}
          {info && (
            <div className="text-green-700 text-sm" role="status">
              {info}
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Registrar"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <button
              className="underline"
              onClick={() => setMode("register")}
            >
              Não tem conta? Registre-se
            </button>
          ) : (
            <button className="underline" onClick={() => setMode("login")}>
              Já tem conta? Entrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}