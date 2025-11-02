import React, { useMemo, useState } from "react";
import { useLoadApps } from "@/hooks/useLoadApps";
import { useAddAppToFavorite } from "@/hooks/useAddAppToFavorite";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { App } from "@/ipc/ipc_types";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

type SortOption = "lastEdited" | "name" | "favorites";

function AppCard({ app, onOpen, onToggleFavorite, isFavoriteLoading }: {
  app: App;
  onOpen: (id: number) => void;
  onToggleFavorite: (id: number, e: React.MouseEvent) => void;
  isFavoriteLoading: boolean;
}) {
  return (
    <div className="rounded-xl border border-(--border) bg-(--background) hover:bg-(--background-lightest) transition-colors overflow-hidden shadow-sm">
      {/* Thumbnail placeholder */}
      <div className="h-32 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20"></div>
      <div className="p-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-semibold truncate" title={app.name}>{app.name}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Edited {formatDistanceToNow(new Date(app.updatedAt), { addSuffix: true })}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={isFavoriteLoading}
            onClick={(e) => onToggleFavorite(app.id, e)}
            className="p-1 h-6 w-6"
          >
            <Star size={14} className={app.isFavorite ? "fill-(--accent) text-(--accent)" : ""} />
          </Button>
        </div>
        <div className="mt-3">
          <Button size="sm" className="w-full" onClick={() => onOpen(app.id)}>
            Open
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MyAppsSection() {
  const navigate = useNavigate();
  const { apps, loading, error } = useLoadApps();
  const { toggleFavorite, isLoading: isFavoriteLoading } = useAddAppToFavorite();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("lastEdited");

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    let list = term
      ? apps.filter((a) => a.name.toLowerCase().includes(term))
      : apps.slice();

    switch (sort) {
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "favorites":
        list.sort((a, b) => Number(b.isFavorite) - Number(a.isFavorite));
        break;
      case "lastEdited":
      default:
        list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    // Respect user rule: max 6 cards per section
    return list.slice(0, 6);
  }, [apps, search, sort]);

  const handleOpen = (id: number) => {
    navigate({ to: "/app-details", search: { appId: id } });
  };

  return (
    <section className="mt-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Meus Apps</h2>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Buscar projetos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-44"
            />
            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger size="sm" className="h-9 px-2">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastEdited">Última edição</SelectItem>
                <SelectItem value="name">Nome (A-Z)</SelectItem>
                <SelectItem value="favorites">Favoritos primeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Carregando apps...</div>
        ) : error ? (
          <div className="text-sm text-red-500">Erro ao carregar apps</div>
        ) : filtered.length === 0 ? (
          <div className="text-sm text-muted-foreground">Nenhum app encontrado</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onOpen={handleOpen}
                onToggleFavorite={toggleFavorite}
                isFavoriteLoading={isFavoriteLoading}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyAppsSection;