const newsletter = document.querySelector(".newsletter");
const heroScroll = document.querySelector("[data-scroll-hero]");
const heroVideo = document.querySelector(".hero-video");
const heroFrameTitle = document.querySelector(".hero-frame-title");
const heroFrameLine = document.querySelector(".hero-frame-line");
const centerPlayVideos = document.querySelectorAll("[data-center-play]");

newsletter?.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = newsletter.querySelector("input[type='email']");
  const button = newsletter.querySelector("button");
  const note = newsletter.querySelector("small");
  const value = input.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  input.setAttribute("aria-invalid", String(!isValid));

  if (!isValid) {
    newsletter.classList.remove("newsletter--success");
    newsletter.classList.add("newsletter--error");
    note.textContent = "Enter a valid email address.";
    return;
  }

  newsletter.classList.remove("newsletter--error");
  newsletter.classList.add("newsletter--success");
  button.textContent = "Joined";
  note.textContent = "You are on the private launch list.";
});

if (heroScroll && heroVideo) {
  if ("scrollRestoration" in window.history && !window.location.hash) {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }

  let pendingFrame = false;
  let metadataReady = false;
  let duration = 0;
  let targetProgress = 0;
  let displayProgress = 0;
  let lastTextProgress = Number.NaN;
  let scrubRaf = 0;
  let lastAppliedTime = Number.NaN;
  let seekInFlight = false;
  let pendingSeekTime = Number.NaN;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const smoothstep = (start, end, value) => {
    const progress = clamp((value - start) / (end - start), 0, 1);
    return progress * progress * (3 - 2 * progress);
  };

  const ensureHeroScrollRange = () => {
    const minimumRange = window.innerHeight * 3.2;

    if (heroScroll.offsetHeight < minimumRange) {
      heroScroll.style.minHeight = `${Math.round(window.innerHeight * 4.2)}px`;
    }
  };

  const getHeroProgress = () => {
    ensureHeroScrollRange();
    const rect = heroScroll.getBoundingClientRect();
    const scrollRange = Math.max(1, heroScroll.offsetHeight - window.innerHeight);
    const nav = heroScroll.querySelector(".site-nav");
    const sticky = heroScroll.querySelector(".hero-sticky");
    const rawScroll = Math.max(0, -rect.top);
    const navHeight = nav?.offsetHeight || 0;
    const headerExitDistance = Math.min(window.innerHeight * 0.52, navHeight + 52);
    const headerProgress = headerExitDistance > 0 ? clamp(rawScroll / headerExitDistance, 0, 1) : 1;

    if (nav) {
      const navExitY = -Math.round(headerProgress * (navHeight + 24));
      nav.style.setProperty("--hero-nav-y", `${navExitY}px`);
      nav.style.setProperty("--hero-nav-opacity", String(Math.round((1 - headerProgress) * 1000) / 1000));
      nav.style.pointerEvents = headerProgress >= 0.98 ? "none" : "";
    }

    if (sticky) {
      sticky.style.setProperty("--hero-video-top", `${Math.round(navHeight * (1 - headerProgress))}px`);
    }

    const delayedScroll = Math.max(0, rawScroll - headerExitDistance);
    const delayedRange = Math.max(1, scrollRange - headerExitDistance);
    return clamp(delayedScroll / delayedRange, 0, 1);
  };

  const seekHeroVideo = (progress, force = false) => {
    if (!metadataReady || duration <= 0) return;

    const endTime = Math.max(0.001, duration - 0.04);
    const targetTime = clamp(endTime * progress, 0.001, endTime);
    const timeDelta = Math.abs(targetTime - lastAppliedTime);

    if (!force && Number.isFinite(lastAppliedTime) && timeDelta < 0.012) return;

    if (seekInFlight || heroVideo.seeking) {
      pendingSeekTime = targetTime;
      return;
    }

    try {
      if (Math.abs(heroVideo.currentTime - targetTime) < 0.01) {
        lastAppliedTime = targetTime;
        return;
      }

      seekInFlight = true;
      lastAppliedTime = targetTime;
      heroVideo.currentTime = targetTime;
    } catch {
      seekInFlight = false;
      // Some mobile browsers reject paused seeks before decode is ready. The next media event will retry.
    }
  };

  const applyPendingHeroSeek = () => {
    seekInFlight = false;
    if (!Number.isFinite(pendingSeekTime)) return;

    const queuedTime = pendingSeekTime;
    pendingSeekTime = Number.NaN;

    if (Math.abs(queuedTime - lastAppliedTime) < 0.012) return;

    try {
      seekInFlight = true;
      lastAppliedTime = queuedTime;
      heroVideo.currentTime = queuedTime;
    } catch {
      seekInFlight = false;
    }
  };

  const setHeroFrameText = (progress) => {
    if (Number.isFinite(lastTextProgress) && Math.abs(progress - lastTextProgress) < 0.003) return;
    lastTextProgress = progress;

    const titleIn = smoothstep(0.88, 0.95, progress);
    const lineIn = smoothstep(0.9, 0.97, progress);
    const fadeOut = 1;

    if (heroFrameTitle) {
      heroFrameTitle.style.opacity = String(Math.round(titleIn * fadeOut * 1000) / 1000);
      heroFrameTitle.style.transform = `translate3d(0, calc(-50% + ${Math.round((1 - titleIn) * 28 * 10) / 10}px), 0)`;
    }

    if (heroFrameLine) {
      heroFrameLine.style.opacity = String(Math.round(lineIn * fadeOut * 1000) / 1000);
      heroFrameLine.style.transform = `translate3d(0, calc(-50% + ${Math.round((1 - lineIn) * 24 * 10) / 10}px), 0)`;
    }
  };

  const updateHeroScrub = () => {
    scrubRaf = 0;
    const distance = targetProgress - displayProgress;
    const isNearTarget = Math.abs(distance) < 0.0007;
    const scrubEase = clamp(0.16 + Math.abs(distance) * 0.9, 0.16, 0.46);

    displayProgress = isNearTarget ? targetProgress : displayProgress + distance * scrubEase;
    seekHeroVideo(displayProgress, isNearTarget);
    setHeroFrameText(displayProgress);

    if (!isNearTarget) {
      scrubRaf = window.requestAnimationFrame(updateHeroScrub);
    }
  };

  const requestHeroScrub = () => {
    if (scrubRaf) return;
    scrubRaf = window.requestAnimationFrame(updateHeroScrub);
  };

  const updateHero = () => {
    pendingFrame = false;
    targetProgress = getHeroProgress();
    if (targetProgress <= 0.001 || targetProgress >= 0.999) {
      displayProgress = targetProgress;
      seekHeroVideo(displayProgress, true);
      setHeroFrameText(displayProgress);
    }
    requestHeroScrub();
  };

  const requestHeroUpdate = () => {
    if (pendingFrame) return;
    pendingFrame = true;
    window.requestAnimationFrame(updateHero);
  };

  const primeHeroVideo = () => {
    duration = Number.isFinite(heroVideo.duration) ? heroVideo.duration : 0;
    metadataReady = duration > 0;
    if (!metadataReady) return;

    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.pause();

    try {
      heroVideo.currentTime = 0.001;
    } catch {
      // The scroll handler will retry after the browser finishes decoding metadata.
    }

    const playPromise = heroVideo.play();

    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => {
          heroVideo.pause();
          seekHeroVideo(displayProgress, true);
          requestHeroUpdate();
        })
        .catch(() => {
          heroVideo.pause();
          seekHeroVideo(displayProgress, true);
          requestHeroUpdate();
        });
    } else {
      heroVideo.pause();
      seekHeroVideo(displayProgress, true);
      requestHeroUpdate();
    }
  };

  heroVideo.muted = true;
  heroVideo.playsInline = true;
  heroVideo.preload = "auto";
  heroVideo.addEventListener("loadedmetadata", primeHeroVideo);
  heroVideo.addEventListener("loadeddata", requestHeroUpdate);
  heroVideo.addEventListener("canplay", requestHeroUpdate);
  heroVideo.addEventListener("seeked", applyPendingHeroSeek);
  window.addEventListener("scroll", requestHeroUpdate, { passive: true });
  window.addEventListener("resize", requestHeroUpdate);
  window.addEventListener("orientationchange", requestHeroUpdate);
  heroVideo.load();
  if (heroVideo.readyState >= 1) primeHeroVideo();
  requestHeroUpdate();
}

if (centerPlayVideos.length) {
  let pendingCenterCheck = false;
  const playedVideos = new WeakSet();

  const updateCenterPlayVideos = () => {
    pendingCenterCheck = false;
    const viewportCenter = window.innerHeight / 2;

    centerPlayVideos.forEach((video) => {
      const section = video.closest("section") || video;
      const rect = section.getBoundingClientRect();
      const isAtCenter = rect.top <= viewportCenter && rect.bottom >= viewportCenter;

      if (!isAtCenter || playedVideos.has(video)) return;

      playedVideos.add(video);
      video.classList.add("is-playing");
      video.closest("section")?.classList.remove("is-paused");
      video.closest("section")?.querySelector("[data-replay-video]")?.classList.remove("is-visible");
      video.currentTime = 0;
      const playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          playedVideos.delete(video);
          video.classList.remove("is-playing");
        });
      }
    });
  };

  const requestCenterCheck = () => {
    if (pendingCenterCheck) return;
    pendingCenterCheck = true;
    window.requestAnimationFrame(updateCenterPlayVideos);
  };

  window.addEventListener("scroll", requestCenterCheck, { passive: true });
  window.addEventListener("resize", requestCenterCheck);
  window.addEventListener("orientationchange", requestCenterCheck);
  centerPlayVideos.forEach((video) => {
    const section = video.closest("section");
    const replayButton = section?.querySelector("[data-replay-video]");
    const soundButton = section?.querySelector("[data-audio-toggle]");
    const soundLabel = soundButton?.querySelector("span");

    const updateSoundButton = () => {
      if (!soundButton || !soundLabel) return;
      const soundOn = !video.muted;
      soundButton.setAttribute("aria-pressed", String(soundOn));
      soundButton.setAttribute("aria-label", soundOn ? "Mute The Trilogy film" : "Unmute The Trilogy film");
      soundLabel.textContent = soundOn ? "Sound On" : "Sound Off";
    };

    const showPlayButton = () => {
      replayButton?.classList.add("is-visible");
      section?.classList.add("is-paused");
    };

    const hidePlayButton = () => {
      replayButton?.classList.remove("is-visible");
      section?.classList.remove("is-paused");
    };

    const playCenterVideo = (restart = false) => {
      hidePlayButton();
      video.classList.add("is-playing");
      if (restart) video.currentTime = 0;
      const playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          video.classList.remove("is-playing");
          showPlayButton();
        });
      }
    };

    const pauseCenterVideo = () => {
      video.pause();
      video.classList.remove("is-playing");
      showPlayButton();
    };

    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    updateSoundButton();

    video.addEventListener("ended", () => {
      video.classList.remove("is-playing");
      showPlayButton();
    });

    video.addEventListener("click", () => {
      if (video.paused) {
        playCenterVideo();
      } else {
        pauseCenterVideo();
      }
    });

    soundButton?.addEventListener("click", () => {
      video.muted = !video.muted;
      updateSoundButton();

      if (video.paused) {
        playCenterVideo();
      }
    });

    replayButton?.addEventListener("click", () => {
      playCenterVideo(video.ended);
    });
  });
  requestCenterCheck();
}

document.querySelectorAll("[data-product-toggle]").forEach((button) => {
  const accordion = button.closest(".product-accordion");
  const panel = accordion?.querySelector(".product-accordion-panel");

  if (!accordion || !panel) return;

  const setAccordionState = (isOpen) => {
    accordion.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
    panel.setAttribute("aria-hidden", String(!isOpen));
  };

  setAccordionState(accordion.classList.contains("is-open"));
  button.addEventListener("click", () => setAccordionState(!accordion.classList.contains("is-open")));
});

const motionItems = document.querySelectorAll("[data-motion]");

if (motionItems.length) {
  const motionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        window.requestAnimationFrame(() => {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      });
    },
    { threshold: 0, rootMargin: "0px 0px -25% 0px" }
  );

  motionItems.forEach((item) => motionObserver.observe(item));
}

document.querySelectorAll("[data-note-popup]").forEach((popup) => {
  const section = popup.closest(".ingredient-section");
  const openButton = section?.querySelector(`[data-note-popup-open="${popup.id}"]`);
  const closeButton = popup.querySelector("[data-note-popup-close]");

  if (!section || !openButton || !closeButton) return;

  const openPopup = () => {
    section.querySelectorAll("[data-note-popup].is-visible").forEach((visiblePopup) => {
      if (visiblePopup === popup) return;
      visiblePopup.classList.remove("is-visible");
      visiblePopup.setAttribute("aria-hidden", "true");
    });
    popup.classList.add("is-visible");
    popup.setAttribute("aria-hidden", "false");
    closeButton.focus({ preventScroll: true });
  };

  const closePopup = () => {
    popup.classList.remove("is-visible");
    popup.setAttribute("aria-hidden", "true");
    openButton.focus({ preventScroll: true });
  };

  openButton.addEventListener("click", openPopup);
  openButton.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openPopup();
  });
  closeButton.addEventListener("click", closePopup);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && popup.classList.contains("is-visible")) {
      closePopup();
    }
  });
});

document.querySelectorAll("[data-presence-gallery]").forEach((gallery) => {
  const slides = Array.from(gallery.querySelectorAll("[data-gallery-slide]"));
  const previousButton = gallery.querySelector("[data-gallery-prev]");
  const nextButton = gallery.querySelector("[data-gallery-next]");
  let activeIndex = 0;
  let autoplayTimer = 0;
  const autoplayDelay = 4600;

  if (!slides.length) return;

  const getWrappedIndex = (index) => (index + slides.length) % slides.length;

  const renderGallery = () => {
    slides.forEach((slide, index) => {
      const isCurrent = index === activeIndex;
      slide.classList.toggle("is-current", isCurrent);
      slide.setAttribute("aria-hidden", String(!isCurrent));
    });
  };

  const moveGallery = (direction) => {
    activeIndex = getWrappedIndex(activeIndex + direction);
    renderGallery();
  };

  const stopAutoplay = () => {
    window.clearInterval(autoplayTimer);
    autoplayTimer = 0;
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = window.setInterval(() => moveGallery(1), autoplayDelay);
  };

  const moveGalleryByControl = (direction) => {
    moveGallery(direction);
    startAutoplay();
  };

  previousButton?.addEventListener("click", () => moveGalleryByControl(-1));
  nextButton?.addEventListener("click", () => moveGalleryByControl(1));
  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") moveGalleryByControl(-1);
    if (event.key === "ArrowRight") moveGalleryByControl(1);
  });
  gallery.addEventListener("mouseenter", stopAutoplay);
  gallery.addEventListener("mouseleave", startAutoplay);
  gallery.addEventListener("focusin", stopAutoplay);
  gallery.addEventListener("focusout", startAutoplay);

  gallery.tabIndex = 0;
  renderGallery();
  startAutoplay();
});

document.querySelectorAll("[data-expression-gallery]").forEach((gallery) => {
  const slides = Array.from(gallery.querySelectorAll("[data-expression-slide]"));
  const previousButton = gallery.querySelector("[data-expression-prev]");
  const nextButton = gallery.querySelector("[data-expression-next]");
  let activeIndex = 0;

  if (!slides.length) return;

  const getWrappedIndex = (index) => (index + slides.length) % slides.length;

  const renderExpressionGallery = () => {
    slides.forEach((slide, index) => {
      const isCurrent = index === activeIndex;
      slide.classList.toggle("is-current", isCurrent);
      slide.setAttribute("aria-hidden", String(!isCurrent));
    });
  };

  const moveExpressionGallery = (direction) => {
    activeIndex = getWrappedIndex(activeIndex + direction);
    renderExpressionGallery();
  };

  previousButton?.addEventListener("click", () => moveExpressionGallery(-1));
  nextButton?.addEventListener("click", () => moveExpressionGallery(1));
  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") moveExpressionGallery(-1);
    if (event.key === "ArrowRight") moveExpressionGallery(1);
  });

  gallery.tabIndex = 0;
  renderExpressionGallery();
});
