import { useRef, useState } from 'react';
import axios from 'axios';
import { Camera, MapPin, Send, AlertTriangle, Mic, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function ReportIssue() {
  const { t } = useLanguage();
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Audio recording
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioError, setAudioError] = useState('');
  const recorderRef = useRef(null);
  const streamRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`);
        },
        () => {
          setError('Unable to retrieve your location');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  const startRecording = async () => {
    setAudioError('');
    try {
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        setAudioError('Audio recording is not supported in this browser.');
        return;
      }

      // Request mic
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const chunks = [];
      recorderRef.current = new MediaRecorder(stream);
      recorderRef.current.ondataavailable = (evt) => {
        if (evt.data && evt.data.size > 0) chunks.push(evt.data);
      };
      recorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);

        // stop tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }
        streamRef.current = null;
      };

      setAudioError('');
      recorderRef.current.start();
      setRecording(true);
    } catch {
      setAudioError('Microphone permission denied or not available.');
    }
  };

  const stopRecording = () => {
    try {
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.stop();
      }
    } catch {
      // ignore
    }
    setRecording(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('description', description);
    formData.append('location', location);
    formData.append('priority', priority);
    if (file) {
      formData.append('image', file);
    }
    if (audioBlob) {
      formData.append('audio', audioBlob, 'recording.webm');
    }


    try {
      const res = await axios.post('http://localhost:5000/api/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(`Issue reported successfully! Assigned Category: ${res.data.category}`);
      navigate('/citizen/dashboard');
    } catch {
      setError('Failed to submit report. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in py-12 bg-light min-h-screen">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('report_title')}</h1>
            <p className="text-gray">{t('report_subtitle')}</p>
          </div>

          {error && (
            <div className="bg-danger-light text-danger p-4 rounded-md mb-6 flex items-center gap-2">
              <AlertTriangle size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-dark font-medium mb-2">{t('upload_photo')}</label>

              <div className="file-upload-wrapper" onClick={() => document.getElementById('fileUpload').click()}>
                {preview ? (
                  <img src={preview} alt="Preview" className="mx-auto rounded-md" style={{ maxHeight: '200px' }} />
                ) : (
                  <div className="flex-col items-center justify-center text-gray">
                    <Camera size={48} className="mb-2 mx-auto text-primary" />
                    <p className="font-medium text-lg text-dark">{t('upload_photo')}</p>
                    <p className="text-sm">JPEG, PNG up to 5MB</p>
                  </div>
                )}
                <input 
                  id="fileUpload" 
                  type="file" 
                  accept="image/*" 
                  className="file-upload-input" 
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Audio Recording */}
            <div className="mb-8">
              <label className="block text-dark font-medium mb-2">Record Audio (optional)</label>
              {audioError && (
                <div className="bg-danger-light text-danger p-4 rounded-md mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} />
                  {audioError}
                </div>
              )}

              <div className="card no-hover" style={{ padding: '16px', marginBottom: '8px' }}>
                {!recording ? (
                  <button type="button" className="btn btn-secondary" onClick={startRecording}>
                    <Mic size={18} /> Start Recording
                  </button>
                ) : (
                  <button type="button" className="btn btn-danger" onClick={stopRecording}>
                    <Square size={18} /> Stop
                  </button>
                )}

                {audioUrl && (
                  <div style={{ marginTop: '12px' }}>
                    <audio controls src={audioUrl} style={{ width: '100%' }} />
                  </div>
                )}
              </div>
            </div>


            {/* Description */}
            <div className="input-group">
              <label>Issue Description</label>
              <textarea 
                className="input-control" 
                rows="4" 
                placeholder="E.g., Garbage accumulation near the main road..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Location */}
            <div className="input-group mb-6">
              <label>Location</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="input-control flex-1" 
                  placeholder={t('capture_gps')}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                <button type="button" className="btn btn-secondary" onClick={getLocation} title={t('capture_gps')}>
                  <MapPin size={20} />
                </button>
              </div>
            </div>

            {/* Priority */}
            <div className="input-group mb-8">
              <label>{t('select_category')}</label>
              <select 
                className="input-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low (Minor Issue)</option>
                <option value="Normal">Normal</option>
                <option value="High">High (Immediate Danger)</option>
              </select>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-primary w-full text-lg py-3" disabled={loading}>
              {loading ? 'Submitting...' : (
                <><Send size={20} /> {t('submit')}</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
