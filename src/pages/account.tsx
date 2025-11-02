import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useAccounts } from "@/hooks/useAccounts";
import { useUpsertAccount } from "@/hooks/useUpsertAccount";
import { useActiveAccount } from "@/hooks/useActiveAccount";
import type { UpsertAccountParams } from "@/ipc/ipc_types";

export default function AccountPage() {
  const router = useRouter();
  const { data: accounts } = useAccounts();
  const { activeAccount, setActiveAccount, isPending: isSettingActive } = useActiveAccount();
  const { upsertAccount, isPending: isSaving } = useUpsertAccount();

  const [form, setForm] = useState<UpsertAccountParams>({
    provider: "",
    email: "",
    name: "",
    avatarUrl: "",
    externalId: "",
  });

  return (
    <div className="pt-8 pb-8">
      <Button
        onClick={() => router.history.back()}
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 mb-6 text-foreground/80 hover:opacity-80"
      >
        <ArrowLeft className="h-4 w-4" />
        Go Back
      </Button>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Account Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Accounts list */}
        <div className="ui-card p-6">
          <h2 className="text-lg font-medium mb-4">Linked Accounts</h2>
          <div className="space-y-3">
            {(accounts || []).length === 0 && (
              <div className="text-sm text-muted-foreground">No accounts linked yet.</div>
            )}
            {(accounts || []).map((acc) => {
              const isActive = !!acc.isActive;
              return (
                <div key={acc.id} className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                      {acc.avatarUrl ? (
                        <img src={acc.avatarUrl} alt={acc.name || acc.email || acc.provider} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 leading-none">{(acc.name || acc.email || acc.provider || "").slice(0, 1).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{acc.name || acc.email || acc.provider}</div>
                      <div className="text-xs text-muted-foreground">
                        Provider: {acc.provider}
                        {acc.email ? ` · ${acc.email}` : ""}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isSettingActive}
                        onClick={() => setActiveAccount({ id: acc.id })}
                      >
                        Set Active
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add / Update account */}
        <div className="ui-card p-6">
          <h2 className="text-lg font-medium mb-4">Add or Update Account</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="provider">Provider</Label>
              <Input
                id="provider"
                value={form.provider || ""}
                onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={form.email || ""}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name || ""}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={form.avatarUrl || ""}
                onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))}
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                onClick={async () => {
                  await upsertAccount(form);
                  setForm({ provider: "", email: "", name: "", avatarUrl: "", externalId: "" });
                }}
                disabled={isSaving || !form.provider}
              >
                {isSaving ? "Saving..." : "Save Account"}
              </Button>
            </div>
            {activeAccount ? (
              <div className="text-xs text-muted-foreground">
                Active account: {activeAccount.name || activeAccount.email || activeAccount.provider}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}