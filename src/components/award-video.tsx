'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type Hls from 'hls.js';
import { Play, X } from '@/components/icons';

interface AwardVideoProps {
  stream: string;
  teaser: string;
  poster: string;
  label: string;
  duration: string;
}

type PlayerState = 'idle' | 'loading' | 'playing' | 'error';

export function AwardVideo({ stream, teaser, poster, label, duration }: AwardVideoProps) {
  const teaserRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [state, setState] = useState<PlayerState>('idle');

  useEffect(() => {
    const video = teaserRef.current;
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.35 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const teardown = useCallback(() => {
    hlsRef.current?.destroy();
    hlsRef.current = null;
    const video = playerRef.current;
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
  }, []);

  useEffect(() => teardown, [teardown]);

  const load = useCallback(async () => {
    const video = playerRef.current;
    if (!video) return;
    teardown();
    setState('loading');
    try {
      const { default: HlsPlayer } = await import('hls.js');
      if (HlsPlayer.isSupported()) {
        const hls = new HlsPlayer({ capLevelToPlayerSize: true, maxBufferLength: 20 });
        hls.on(HlsPlayer.Events.ERROR, (_event, data) => {
          if (data.fatal) setState('error');
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        hlsRef.current = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else {
        setState('error');
        return;
      }
      await video.play();
    } catch {
      setState((current) => (current === 'playing' ? current : 'error'));
    }
  }, [stream, teardown]);

  const open = () => {
    teaserRef.current?.pause();
    dialogRef.current?.showModal();
    void load();
  };

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button type="button" className="award-preview" onClick={open} aria-haspopup="dialog">
        <video
          ref={teaserRef}
          src={teaser}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          width={960}
          height={600}
        />
        <span className="award-play">
          <Play aria-hidden="true" size={18} weight="fill" />
          Watch the demo
          <span className="award-play-duration">{duration}</span>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        className="video-dialog"
        aria-label={label}
        onClose={() => {
          teardown();
          setState('idle');
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="video-dialog-frame" data-state={state}>
          <video
            ref={playerRef}
            poster={poster}
            controls
            playsInline
            width={2560}
            height={1600}
            onPlaying={() => setState('playing')}
            onWaiting={() => setState((current) => (current === 'error' ? current : 'loading'))}
          />
          {state === 'loading' && (
            <p className="video-dialog-status" role="status">
              Loading video
            </p>
          )}
          {state === 'error' && (
            <div className="video-dialog-status" role="alert">
              <p>The video could not load.</p>
              <button type="button" className="button" onClick={() => void load()}>
                Try again
              </button>
            </div>
          )}
        </div>
        <button
          type="button"
          className="video-dialog-close"
          onClick={close}
          aria-label="Close video"
        >
          <X aria-hidden="true" size={22} />
        </button>
      </dialog>
    </>
  );
}
