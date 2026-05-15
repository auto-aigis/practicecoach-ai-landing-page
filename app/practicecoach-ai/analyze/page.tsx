"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { analysisApi } from "@/_lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mic, Upload, Play, Square } from "lucide-react";

export default function AnalyzePage() {
  const router = useRouter();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [instrument, setInstrument] = useState<"guitar" | "piano" | "vocals" | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isRecording) return;
    const timer = setInterval(() => {
      setRecordingTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    if (!isRecording || !analyserRef.current) return;

    const drawWaveform = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const bufferLength = analyserRef.current!.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current!.getByteFrequencyData(dataArray);

      ctx.fillStyle = "rgb(17, 24, 39)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgb(59, 130, 246)";
      ctx.lineWidth = 2;
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(drawWaveform);
    };

    drawWaveform();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRecording]);

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const source = audioContext.createMediaStreamAudioSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstart = () => {
        setIsRecording(true);
        setRecordingTime(0);
      };

      mediaRecorder.onend = () => {
        setIsRecording(false);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    } catch (err) {
      setError("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      setError("File must be under 25MB");
      return;
    }
    setUploadedFile(file);
    setError("");
  };

  const submitAnalysis = async () => {
    let fileToAnalyze: File | null = null;

    if (uploadedFile) {
      fileToAnalyze = uploadedFile;
    } else if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      fileToAnalyze = new File([audioBlob], "recording.webm", { type: "audio/webm" });
    }

    if (!fileToAnalyze || !instrument) {
      setError("Please record audio and select an instrument");
      return;
    }

    setAnalyzing(true);
    setError("");

    try {
      const result = await analysisApi.analyze(fileToAnalyze, instrument);

      if (!result.quality_check_passed) {
        setError(result.message || "Audio quality too poor. Please try again in a quieter environment.");
        setAnalyzing(false);
        return;
      }

      router.push(`/practicecoach-ai/results/${result.session_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setAnalyzing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const audioBlob = audioChunksRef.current.length > 0 ? new Blob(audioChunksRef.current, { type: "audio/webm" }) : null;
  const hasAudio = audioBlob || uploadedFile;

  return (
    <div className="flex-1 bg-gray-900 p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">Analyze Your Performance</h1>
        <p className="text-gray-400 mb-8">
          Record or upload a short clip of your playing, and we'll provide personalized feedback and a practice drill.
        </p>

        {error && (
          <Alert className="mb-6 bg-red-950 border-red-800">
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Step 1: Select Your Instrument</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {(["guitar", "piano", "vocals"] as const).map((inst) => (
                  <Button
                    key={inst}
                    onClick={() => setInstrument(inst)}
                    variant={instrument === inst ? "default" : "outline"}
                    className={
                      instrument === inst
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "border-gray-600 text-gray-300 hover:border-gray-400 hover:bg-gray-700"
                    }
                  >
                    {inst.charAt(0).toUpperCase() + inst.slice(1)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Step 2: Pre-Recording Guidance</CardTitle>
              <CardDescription>For best results:</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Record in a quiet room (minimize background noise)</li>
                <li>• Hold your instrument 1–2 feet from your microphone</li>
                <li>• Use clear audio — avoid heavy reverb or echo</li>
                <li>• Record 30–60 seconds of your best playing</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Step 3: Record or Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isRecording && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-300">Recording... {formatTime(recordingTime)}</p>
                    <Badge className="bg-red-600">● LIVE</Badge>
                  </div>
                  <canvas
                    ref={canvasRef}
                    className="w-full h-32 bg-gray-900 rounded"
                    width={400}
                    height={100}
                  />
                </div>
              )}

              {!isRecording && (
                <div className="space-y-3">
                  <div>
                    <Button
                      onClick={startRecording}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-2"
                    >
                      <Mic className="mr-2 h-4 w-4" />
                      Start Recording
                    </Button>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div>
                    <label className="block mb-2 text-gray-300 text-sm font-medium">
                      Or upload an audio file:
                    </label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                    {uploadedFile && (
                      <p className="mt-2 text-sm text-gray-400">
                        Selected: <strong>{uploadedFile.name}</strong>
                      </p>
                    )}
                  </div>
                </div>
              )}

               {isRecording && (
                 <Button
                   onClick={stopRecording}
                   className="w-full bg-red-600 hover:bg-red-700 text-white"
                 >
                   <Square className="mr-2 h-4 w-4" />
                   Stop Recording
                 </Button>
               )}


              {hasAudio && !isRecording && (
                <Button
                  onClick={submitAnalysis}
                  disabled={analyzing || !instrument}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {analyzing ? "Analyzing..." : "Analyze My Performance"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
