import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Globe, Plus } from "lucide-react";

interface MobileAppTypeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: "convert" | "scratch") => void;
  hasExistingApp: boolean;
}

export function MobileAppTypeSelector({
  isOpen,
  onClose,
  onSelect,
  hasExistingApp,
}: MobileAppTypeSelectorProps) {
  const handleSelect = (type: "convert" | "scratch") => {
    onSelect(type);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Escolha o tipo de desenvolvimento mobile</DialogTitle>
          <DialogDescription>
            Como você gostaria de criar seu aplicativo mobile?
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {hasExistingApp && (
            <Card 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSelect("convert")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe className="w-5 h-5" />
                  Converter Web App Existente
                </CardTitle>
                <CardDescription>
                  Transforme seu web app atual em um aplicativo iOS/Android nativo
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm text-muted-foreground">
                  • Mantém funcionalidades existentes
                  • Adiciona recursos nativos mobile
                  • Processo mais rápido
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => handleSelect("scratch")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Plus className="w-5 h-5" />
                Criar App do Zero
              </CardTitle>
              <CardDescription>
                Desenvolva um novo aplicativo mobile desde o início
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-muted-foreground">
                • Design otimizado para mobile
                • Funcionalidades específicas para iOS/Android
                • Máxima flexibilidade
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}