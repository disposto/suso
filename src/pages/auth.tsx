import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Github, Globe } from "lucide-react";

export default function AuthPage() {
  const { signInWithEmail, signUpWithEmail, signInWithOAuth } = useSupabaseAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "login") {
        await signInWithEmail(email.trim(), password);
      } else {
        await signUpWithEmail(email.trim(), password);
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
              ? "Use seu e-mail e senha da Supabase"
              : "Registre-se com e-mail e senha"}
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
            <label className="text-sm">E-mail</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              required
            />
          </div>
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