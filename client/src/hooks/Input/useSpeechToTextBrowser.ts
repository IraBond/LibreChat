import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useToastContext } from '~/Providers';
import store from '~/store';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useGetAudioSettings from './useGetAudioSettings';

const useSpeechToTextBrowser = () => {
  const { showToast } = useToastContext();
  const [languageSTT] = useRecoilState<string>(store.languageSTT);
  const [autoTranscribeAudio] = useRecoilState<boolean>(store.autoTranscribeAudio);
  const { useExternalSpeechToText } = useGetAudioSettings();
  const [isListening, setIsListening] = useState(false);

  const {
    interimTranscript,
    finalTranscript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const toggleListening = () => {
    if (browserSupportsSpeechRecognition) {
      if (!isMicrophoneAvailable) {
        showToast({
          message: 'Microphone is not available',
          status: 'error',
        });
        return;
      }

      if (listening) {
        setIsListening(false);
        SpeechRecognition.stopListening();
      } else {
        setIsListening(true);
        SpeechRecognition.startListening({
          language: languageSTT,
          continuous: autoTranscribeAudio,
        });
      }
    } else {
      showToast({
        message: 'Browser does not support SpeechRecognition',
        status: 'error',
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.altKey && e.code === 'KeyL' && !useExternalSpeechToText) {
        toggleListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!listening) {
      setIsListening(false);
    }
  }, [listening]);

  return {
    isListening: isListening,
    isLoading: false,
    interimTranscript,
    text: finalTranscript,
    startRecording: toggleListening,
    stopRecording: toggleListening,
  };
};

export default useSpeechToTextBrowser;
