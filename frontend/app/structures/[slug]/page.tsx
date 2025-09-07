"use client";

import { useState, use } from "react";
import { useDataStructure } from "@/hooks/useDataStructure";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  RefreshCw,
  Plus,
  Minus,
  Search,
  RotateCcw,
  Zap,
} from "lucide-react";
import { PageLoadingSpinner } from "@/components/loading-spinner";
import { HelpModal } from "@/components/structures/HelpModal";
import { OperationHistoryPanel } from "@/components/structures/OperationHistoryPanel";
import { StructureStatistics } from "@/components/structures/StructureStatistics";
import { PropertiesCard } from "@/components/structures/PropertiesCard";
import { OperationsCard } from "@/components/structures/OperationsCard";
import { useRouter } from "next/navigation";

// Local components
import {
  StructureHeader,
  StructureTabs,
  TheoryTab,
  ChallengesTab,
  InteractiveVisualizer,
} from "./components";

export default function DataStructurePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [recentQuizScore, setRecentQuizScore] = useState<number | null>(null);
  const [bestQuizScore, setBestQuizScore] = useState<number | null>(null);
  const resolvedParams = use(params);
  const dataStructureSlug = resolvedParams.slug;
  const router = useRouter();

  // Interactive visualizer state
  const [operationHistory, setOperationHistory] = useState<string[]>([]);
  const [highlightedItem, setHighlightedItem] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [showHelp, setShowHelp] = useState(false);

  // Fetch data structure from API
  const {
    dataStructure,
    loading,
    error,
    retry,
    getGeneralContent,
    getProperties,
    getOperations,
    getApplications,
    getResources,
  } = useDataStructure(dataStructureSlug);

  // Utility functions
  const getStructureType = () => {
    const slug = dataStructure?.slug.toLowerCase() || "";
    if (slug.includes("enlazada-doble")) return "double-linked-list";
    if (slug.includes("enlazada-circular")) return "circular-linked-list";
    if (slug.includes("linked") || slug.includes("enlazada"))
      return "linked-list";
    if (slug.includes("tree") || slug.includes("arbol") || slug.includes("bst"))
      return "tree";
    if (slug.includes("graph") || slug.includes("grafo")) return "graph";
    if (slug.includes("hash") || slug.includes("tabla")) return "hash";
    if (slug.includes("heap") || slug.includes("montículo")) return "heap";
    if (slug.includes("stack") || slug.includes("pila")) return "stack";
    if (slug.includes("queue") || slug.includes("cola")) return "queue";
    return "array";
  };

  const getOperationIcon = (operationName: string) => {
    const operation = operationName.toLowerCase();

    if (
      operation.includes("insert") ||
      operation.includes("add") ||
      operation.includes("push") ||
      operation.includes("enqueue") ||
      operation.includes("append") ||
      operation.includes("set")
    ) {
      return <Plus className="w-4 h-4" />;
    } else if (
      operation.includes("delete") ||
      operation.includes("remove") ||
      operation.includes("pop") ||
      operation.includes("dequeue") ||
      operation.includes("extract") ||
      operation.includes("unset")
    ) {
      return <Minus className="w-4 h-4" />;
    } else if (
      operation.includes("search") ||
      operation.includes("find") ||
      operation.includes("lookup") ||
      operation.includes("peek") ||
      operation.includes("get") ||
      operation.includes("contains")
    ) {
      return <Search className="w-4 h-4" />;
    } else if (operation.includes("clear") || operation.includes("empty")) {
      return <RotateCcw className="w-4 h-4" />;
    } else {
      return <Zap className="w-4 h-4" />;
    }
  };

  const needsInputValue = (operationName: string) => {
    const operation = operationName.toLowerCase();
    return (
      operation.includes("insert") ||
      operation.includes("add") ||
      operation.includes("push") ||
      operation.includes("enqueue") ||
      operation.includes("append") ||
      operation.includes("set")
    );
  };

  const needsSearchValue = (operationName: string) => {
    const operation = operationName.toLowerCase();
    return (
      operation.includes("search") ||
      operation.includes("find") ||
      operation.includes("lookup") ||
      operation.includes("get") ||
      operation.includes("contains")
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "principiante":
        return "bg-green-500";
      case "intermedio":
        return "bg-yellow-500";
      case "avanzado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "principiante":
        return "Principiante";
      case "intermedio":
        return "Intermedio";
      case "avanzado":
        return "Avanzado";
      default:
        return difficulty;
    }
  };

  if (loading) {
    return <PageLoadingSpinner text="Cargando estructura de datos..." />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">
            Error al Cargar Contenido
          </h1>
          <p className="text-muted-foreground">{error}</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button onClick={retry} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Intentar de Nuevo
            </Button>
            <Button onClick={() => router.push("/")}>
              <ArrowRight className="w-4 h-4 mr-2" />
              Volver a Estructuras
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!dataStructure) {
    return (
      <div className="p-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">
            Estructura de Datos No Encontrada
          </h1>
          <p className="text-muted-foreground">
            La estructura de datos solicitada no pudo ser encontrada.
          </p>
          <Button onClick={() => router.push("/")}>
            <ArrowRight className="w-4 h-4 mr-2" />
            Volver a Estructuras
          </Button>
        </div>
      </div>
    );
  }

  const generalContent = getGeneralContent();
  const properties = getProperties();
  const operations = getOperations();
  const applications = getApplications();
  const resources = getResources();
  const videos = dataStructure?.videos || [];

  const renderGenericVisualizer = () => {
    return (
      <InteractiveVisualizer
        dataStructureSlug={dataStructure.slug}
        operations={operations}
        isAnimating={isAnimating}
        setIsAnimating={setIsAnimating}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        highlightedItem={highlightedItem}
        setHighlightedItem={setHighlightedItem}
        operationHistory={operationHistory}
        setOperationHistory={setOperationHistory}
        showHelp={showHelp}
        setShowHelp={setShowHelp}
        getStructureType={getStructureType}
        getOperationIcon={getOperationIcon}
        needsInputValue={needsInputValue}
        needsSearchValue={needsSearchValue}
      />
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6">
      {/* Header */}
      <StructureHeader
        title={dataStructure.title}
        description={dataStructure.description}
        difficulty={dataStructure.difficulty}
        creatorName={dataStructure.creator.name}
        updatedAt={dataStructure.updatedAt}
        getDifficultyColor={getDifficultyColor}
        getDifficultyText={getDifficultyText}
      />

      {/* Main Content Tabs */}
      <StructureTabs
        theory={
          <TheoryTab
            generalContent={generalContent}
            applications={applications}
            resources={resources}
            videos={videos}
          />
        }
        visualizer={
          <div className="space-y-4 sm:space-y-6">
            {dataStructure.slug !== "stack" &&
              dataStructure.slug !== "queue" && (
                <>
                  {renderGenericVisualizer()}
                  <div className="space-y-4 sm:space-y-6">
                    <OperationHistoryPanel
                      operationHistory={operationHistory}
                    />
                    {/* <StructureStatistics
                      items={[]}
                      operationHistory={operationHistory}
                      getStructureType={getStructureType}
                    /> */}
                    <PropertiesCard properties={properties} />
                    <OperationsCard operations={operations} />
                  </div>
                </>
              )}
          </div>
        }
        challenges={
          <ChallengesTab
            dataStructureId={dataStructure.id}
            dataStructureSlug={dataStructure.slug}
            onRecentScore={setRecentQuizScore}
            onBestScore={setBestQuizScore}
          />
        }
      />

      {/* Help Modal */}
      {showHelp && (
        <HelpModal show={showHelp} onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
}
