import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, ExternalLink } from "lucide-react";
import { VideoModal } from "@/components/ui/video-modal";
import { useState } from "react";

interface TheoryTabProps {
  generalContent: any[];
  applications: any[];
  resources: any[];
  videos?: any[];
}

export function TheoryTab({
  generalContent,
  applications,
  resources,
  videos = [],
}: TheoryTabProps) {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{
    url: string;
    title: string;
    duration?: number;
  } | null>(null);

  // Find animation video (prefer animation type, fallback to first video)
  const animationVideo =
    videos.find((video) => video.videoType === "animation") || videos[0];

  // const handlePlayVideo = () => {
  //   if (animationVideo) {
  //     setSelectedVideo({
  //       url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/videos/${animationVideo.id}`,
  //       title: animationVideo.title,
  //       duration: animationVideo.duration
  //     })
  //     setIsVideoModalOpen(true)
  //   }
  // }

  const handlePlayVideo = () => {
    if (animationVideo) {
      const videoUrl = `/${animationVideo.filePath.replace(/^public[\\/]/, '').replace(/^\/+/, '')}`;
      console.log("Video URL in TheoryTab:", videoUrl); // Log the video URL
      setSelectedVideo({
        url: videoUrl,
        title: animationVideo.title,
        duration: animationVideo.duration,
      });
      setIsVideoModalOpen(true);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* General Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <BookOpen className="w-5 h-5" />
              Descripción General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {generalContent.length > 0 ? (
              generalContent.map((content) => (
                <div key={content.id}>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">
                    {content.name}
                  </h4>
                  <div
                    className="prose max-w-none text-sm"
                    dangerouslySetInnerHTML={{
                      __html: content.description || "",
                    }}
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No hay información general disponible.
              </p>
            )}
            <Button
              className="w-full text-sm sm:text-base"
              onClick={handlePlayVideo}
              disabled={!animationVideo}
            >
              <Play className="w-4 h-4 mr-2" />
              {animationVideo ? "Ver Animación" : "Animación No Disponible"}
            </Button>
          </CardContent>
        </Card>

        {/* Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Play className="w-5 h-5" />
              Aplicaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((content) => (
                  <div key={content.id}>
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">
                      {content.name}
                    </h4>
                    <div
                      className="prose max-w-none text-sm"
                      dangerouslySetInnerHTML={{
                        __html: content.description || "",
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No hay aplicaciones disponibles.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <ExternalLink className="w-5 h-5" />
            Recursos Adicionales
          </CardTitle>
        </CardHeader>
        <CardContent>
          {resources.length > 0 ? (
            <div className="space-y-4">
              {resources.map((content) => (
                <div key={content.id}>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">
                    {content.name}
                  </h4>
                  {content.format === "link" ||
                  (content.format === "video" && content.description) ? (
                    <a
                      href={content.description}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm"
                    >
                      {content.name}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <div
                      className="prose max-w-none text-sm"
                      dangerouslySetInnerHTML={{
                        __html: content.description || "",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No hay recursos adicionales disponibles.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={() => {
            setIsVideoModalOpen(false);
            setSelectedVideo(null);
          }}
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
          duration={selectedVideo.duration}
        />
      )}
    </div>
  );
}
