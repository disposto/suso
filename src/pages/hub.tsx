import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearch } from "@tanstack/react-router";
import { useSettings } from "@/hooks/useSettings";
import { useTemplates } from "@/hooks/useTemplates";
import { TemplateCard } from "@/components/TemplateCard";
import { CreateAppDialog } from "@/components/CreateAppDialog";
import { NeonConnector } from "@/components/NeonConnector";

const HubPage: React.FC = () => {
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { templates, isLoading } = useTemplates();
  const { settings, updateSettings } = useSettings();
  const selectedTemplateId = settings?.selectedTemplateId;
  const { search: searchValue, sort, category } = useSearch({ from: "/hub" });

  const handleTemplateSelect = (templateId: string) => {
    updateSettings({ selectedTemplateId: templateId });
  };

  const handleCreateApp = () => {
    setIsCreateDialogOpen(true);
  };
  // Separate templates into official and community
  const officialTemplates = templates?.filter((template) => template.isOfficial) || [];
  const communityTemplatesBase = templates?.filter((template) => !template.isOfficial) || [];

  // Apply filters from search params for community templates when present
  const communityTemplates = useMemo(() => {
    const term = (searchValue ?? "").trim().toLowerCase();
    const bySearch = term
      ? communityTemplatesBase.filter(
          (t) =>
            t.title.toLowerCase().includes(term) ||
            (t.description || "").toLowerCase().includes(term),
        )
      : communityTemplatesBase;
    const byCategory = (cat: string) => {
      const text = (t: typeof bySearch[number]) => (t.title + " " + (t.description || "")).toLowerCase();
      switch (cat) {
        case "internal-tools":
          return bySearch.filter((t) => /internal|tool|dashboard|ops/.test(text(t)));
        case "website":
          return bySearch.filter((t) => /website|site|web|landing|page|cms/.test(text(t)));
        case "personal":
          return bySearch.filter((t) => /personal|portfolio|blog/.test(text(t)));
        case "consumer-app":
          return bySearch.filter((t) => /consumer|mobile|app|ios|android/.test(text(t)));
        case "b2b-app":
          return bySearch.filter((t) => /b2b|business|saas|crm|erp/.test(text(t)));
        case "prototype":
          return bySearch.filter((t) => /prototype|experimental|alpha|beta/.test(text(t)));
        case "discover":
        default:
          return bySearch;
      }
    };
    const filtered = byCategory(category ?? "discover");
    const sorted = filtered.slice();
    switch (sort) {
      case "popular":
      case "recent":
      case "trending":
      case "featured":
      default:
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return sorted;
  }, [communityTemplatesBase, searchValue, sort, category]);

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
        <header className="mb-8 text-left">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
            Pick your default template
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose a starting point for your new project.
            {isLoading && " Loading additional templates..."}
          </p>
        </header>

        {/* Official Templates Section */}
        {officialTemplates.length > 0 && (
          <section className="mb-12 ui-card p-6">
            <h2 className="text-xl font-semibold tracking-tight mb-6">
              Official templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {officialTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={template.id === selectedTemplateId}
                  onSelect={handleTemplateSelect}
                  onCreateApp={handleCreateApp}
                />
              ))}
            </div>
          </section>
        )}

        {/* Community Templates Section */}
        {communityTemplates.length > 0 && (
          <section className="mb-12 ui-card p-6">
            <h2 className="text-xl font-semibold tracking-tight mb-6">
              Community templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communityTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={template.id === selectedTemplateId}
                  onSelect={handleTemplateSelect}
                  onCreateApp={handleCreateApp}
                />
              ))}
            </div>
          </section>
        )}

        <BackendSection />

      <CreateAppDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        template={templates.find((t) => t.id === settings?.selectedTemplateId)}
      />
    </div>
  );
};

function BackendSection() {
  return (
    <div className="ui-card p-6">
      <header className="mb-4 text-left">
        <h2 className="text-xl font-semibold tracking-tight mb-2">
          Backend Services
        </h2>
        <p className="text-sm text-muted-foreground">
          Connect to backend services for your projects.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <NeonConnector />
      </div>
    </div>
  );
}

export default HubPage;
