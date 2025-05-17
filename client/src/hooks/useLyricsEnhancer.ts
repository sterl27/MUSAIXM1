import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Persona, EnhancementOptions } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";

interface EnhanceParams {
  lyrics: string;
  persona: Persona;
  options: EnhancementOptions;
}

interface EnhanceResponse {
  enhancedLyrics: string;
}

export function useLyricsEnhancer() {
  const [enhancedLyrics, setEnhancedLyrics] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enhanceMutation = useMutation({
    mutationFn: async ({ lyrics, persona, options }: EnhanceParams) => {
      const res = await apiRequest("POST", "/api/enhance", {
        lyrics,
        personaId: persona.id,
        options
      });
      return res.json() as Promise<EnhanceResponse>;
    },
    onSuccess: (data) => {
      setEnhancedLyrics(data.enhancedLyrics);
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to enhance lyrics");
      console.error("Error enhancing lyrics:", err);
    }
  });

  const enhance = (params: EnhanceParams) => {
    enhanceMutation.mutate(params);
  };

  return {
    enhancedLyrics,
    isEnhancing: enhanceMutation.isPending,
    enhance,
    error
  };
}
