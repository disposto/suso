import React, { useMemo, useState } from "react";
import { useTemplates } from "@/hooks/useTemplates";
import { useSettings } from "@/hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TemplateCard } from "@/components/TemplateCard";
import type { Template } from "@/shared/templates";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { showError, showSuccess } from "@/lib/toast";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";

function sortByUsage(a: Template, b: Template) {
  const ua = a.usageCount ?? 0;
  const ub = b.usageCount ?? 0;
  return ub - ua;
}

type SortOption = "featured" | "popular" | "recent" | "trending";
type CategoryOption =
  | "discover"
  | "internal-tools"
  | "website"
  | "personal"
  | "consumer-app"
  | "b2b-app"
  | "prototype";

function matchesCategory(t: Template, category: CategoryOption): boolean {
  if (category === "discover") return true;
  const text = (t.title + " " + (t.description || "")).toLowerCase();
  switch (category) {
    case "internal-tools":
      return /internal|tool|dashboard|ops/.test(text);
    case "website":
      return /website|site|web|landing|page|cms/.test(text);
    case "personal":
      return /personal|portfolio|blog/.test(text);
    case "consumer-app":
      return /consumer|mobile|app|ios|android/.test(text);
    case "b2b-app":
      return /b2b|business|saas|crm|erp/.test(text);
    case "prototype":
      return /prototype|experimental|alpha|beta/.test(text);
    default:
      return true;
  }
}

export function CommunityTemplatesSection() {
  const { templates, isLoading } = useTemplates();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [category, setCategory] = useState<CategoryOption>("discover");
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const communityTemplates = useMemo(() => {
    const list = (templates || []).filter((t) => !t.isOfficial);
    const term = search.trim().toLowerCase();
    const bySearch = term
      ? list.filter(
          (t) =>
            t.title.toLowerCase().includes(term) ||
            (t.description || "").toLowerCase().includes(term),
        )
      : list;
    const byCategory = bySearch.filter((t) => matchesCategory(t, category));

    // Sorting – placeholder heuristics until API provides metrics
    const sorted = byCategory.slice();
    switch (sort) {
      case "popular":
        // Fallback: sort by title to keep deterministic order until popularity data is available
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "recent":
        // No createdAt/updatedAt on templates: fallback to alphabetical for now
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "trending":
        // Fallback: alphabetical
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "featured":
      default:
        // Keep stable order as featured
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    // Respect user rule: max 6 cards per section
    return sorted.slice(0, 6);
  }, [templates, search, sort, category]);

  const handleSelect = (id: string) => setSelectedTemplateId(id);
  const handleCreateApp = () => {
    // Reuse CreateAppDialog from Hub page via TemplateCard button
    showSuccess("Abra o Hub para criar um app com este template.");
  };

  return (
    <section className="mt-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Community Templates</h2>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Buscar templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-48"
            />
            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger size="sm" className="h-9 px-2">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Em destaque</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="recent">Recentes</SelectItem>
                <SelectItem value="trending">Em alta</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => setIsPublishOpen(true)}>
              Publicar Template
            </Button>
          </div>
        </div>

        {/* Categories tabs */}
        <Tabs value={category} onValueChange={(v) => setCategory(v as CategoryOption)}>
          <TabsList className="mb-4">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="internal-tools">Internal Tools</TabsTrigger>
            <TabsTrigger value="website">Website</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="consumer-app">Consumer App</TabsTrigger>
            <TabsTrigger value="b2b-app">B2B App</TabsTrigger>
            <TabsTrigger value="prototype">Prototype</TabsTrigger>
          </TabsList>
        </Tabs>
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Carregando templates...</div>
        ) : communityTemplates.length === 0 ? (
          <div className="text-sm text-muted-foreground">Nenhum template disponível</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {communityTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplateId === template.id}
                onSelect={handleSelect}
                onCreateApp={handleCreateApp}
              />
            ))}
          </div>
        )}

        {/* View More */}
        <div className="flex justify-end mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              navigate({
                to: "/hub",
                search: { search, sort, category },
              })
            }
          >
            Ver mais
          </Button>
        </div>
      </div>

      {/* Publish dialog (PRO required) */}
      <PublishTemplateDialog
        open={isPublishOpen}
        onOpenChange={setIsPublishOpen}
        isPro={Boolean(settings?.enableDyadPro)}
      />
    </section>
  );
}

function PublishTemplateDialog({ open, onOpenChange, isPro }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  isPro: boolean;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!isPro) {
      showError("Somente usuários PRO podem publicar templates.");
      return;
    }
    if (!name.trim() || !category.trim() || !description.trim()) {
      showError("Preencha todos os campos.");
      return;
    }
    // Placeholder: IPC call to publish will be added later
    showSuccess("Template enviado para revisão.");
    onOpenChange(false);
    setName("");
    setCategory("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publicar Template (PRO)</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Nome do template" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Categoria" value={category} onChange={(e) => setCategory(e.target.value)} />
          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-24 rounded-md border border-(--border) bg-(--background) p-2 text-sm"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>Publicar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommunityTemplatesSection;