/* ================================
   Get Grid Size from CSS
================================ */

const gridSize = () => {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--grid-size');
  return Number.parseFloat(value) || 48;
};


/* ================================
   Create Transition Block
================================ */

const createTransitionBlock = (x, y) => {
  const block = document.createElement('div');

  block.className = 'transition-block';
  block.style.setProperty('--transition-x', `${x}px`);
  block.style.setProperty('--transition-y', `${y}px`);

  document.body.appendChild(block);

  return block;
};


/* ================================
   Page Leave Transition
   Mouse position → fullscreen blue block
================================ */

const setupPageLeaveTransition = () => {
  const transitionLinks = document.querySelectorAll('a[data-transition]');

  transitionLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      event.preventDefault();

      const href = link.getAttribute('href');
      if (!href) return;

      const startX = event.clientX;
      const startY = event.clientY;

      const block = createTransitionBlock(startX, startY);

      link.classList.add('is-selected');

      sessionStorage.setItem('ji-page-transition', 'block-mask');
      sessionStorage.setItem('ji-transition-x', startX);
      sessionStorage.setItem('ji-transition-y', startY);

      requestAnimationFrame(() => {
        block.classList.add('is-expanding');
      });

      window.setTimeout(() => {
        window.location.href = href;
      }, 420);
    });
  });
};


/* ================================
   Page Enter Transition
   Fullscreen blue block → mouse position
================================ */

const createBlockReveal = () => {
  const startX = Number(sessionStorage.getItem('ji-transition-x')) || window.innerWidth / 2;
  const startY = Number(sessionStorage.getItem('ji-transition-y')) || window.innerHeight / 2;

  const block = createTransitionBlock(startX, startY);

  block.classList.add('is-fullscreen');

  // 关键：强制浏览器先渲染“全屏状态”，再执行缩回动画
  block.getBoundingClientRect();

  requestAnimationFrame(() => {
    block.classList.add('is-shrinking');
  });

  window.setTimeout(() => {
    block.remove();
    sessionStorage.removeItem('ji-transition-x');
    sessionStorage.removeItem('ji-transition-y');
  }, 520);
};


/* ================================
   Setup Page Enter Transition
================================ */

const setupPageEnterTransition = () => {
  const shouldReveal =
    document.body.classList.contains('is-entering-page') ||
    sessionStorage.getItem('ji-page-transition') === 'block-mask';

  if (!shouldReveal) return;

  document.body.classList.add('is-entering-page');
  sessionStorage.removeItem('ji-page-transition');

  createBlockReveal();

  const content = document.querySelector('.page-content');

  window.setTimeout(() => {
    if (content) content.classList.add('is-visible');
  }, 160);

  window.setTimeout(() => {
    document.body.classList.remove('is-entering-page');
  }, 620);
};


/* ================================
   Init
================================ */

setupPageLeaveTransition();
setupPageEnterTransition();


/* ================================
   GraphicDesign
   Scrapbook poster stack
================================ */

const posterCards = document.querySelectorAll(".poster-card");
const posterGrid = document.querySelector(".poster-grid");

if (posterCards.length && posterGrid) {
  let activeIndex = 0;
  let posterTimer = null;

  // 记录当前最高的基础层级
  let topZ = posterCards.length;

  const isMobilePosterLayout = () =>
    window.matchMedia("(max-width: 768px)").matches;

  const promotePoster = (card) => {
    topZ += 1;

    // 关键：更新这张 poster 自己的基础层级
    // 这样即使之后 is-active 被移除，它也不会回到原来的层级
    card.style.setProperty("--z", topZ);
  };

  const setActivePoster = (index) => {
    if (isMobilePosterLayout()) return;

    activeIndex = index;

    const activeCard = posterCards[activeIndex];

    promotePoster(activeCard);

    posterCards.forEach((card, cardIndex) => {
      card.classList.toggle("is-active", cardIndex === activeIndex);
    });
  };

  const startPosterRotation = () => {
    if (isMobilePosterLayout() || posterTimer) return;

    posterTimer = window.setInterval(() => {
      const nextIndex = (activeIndex + 1) % posterCards.length;
      setActivePoster(nextIndex);
    }, 3000);
  };

  const stopPosterRotation = () => {
    if (!posterTimer) return;

    window.clearInterval(posterTimer);
    posterTimer = null;
  };

  posterCards.forEach((card, index) => {
    card.addEventListener("mouseenter", () => {
      stopPosterRotation();

      // hover 的 poster 会变成新的 active
      // 同时它的基础层级也会被真正提升
      setActivePoster(index);
    });

    card.addEventListener("mouseleave", () => {
      // 不在这里移除 is-active
      // 让 hover 过的 poster 继续留在当前最高层
    });
  });

  posterGrid.addEventListener("mouseleave", () => {
    // 鼠标离开整个 poster 区域后，自动轮播继续
    // 但刚刚 hover 的 poster 已经被 promotePoster() 提升过基础层级
    startPosterRotation();
  });

  window.addEventListener("resize", () => {
    if (isMobilePosterLayout()) {
      stopPosterRotation();

      posterCards.forEach((card) => {
        card.classList.remove("is-active");
      });

      return;
    }

    setActivePoster(activeIndex);
    startPosterRotation();
  });

  setActivePoster(0);
  startPosterRotation();
}

/* ================================
   Photography
   Cover ripple effect
================================ */

const photoCards = document.querySelectorAll(".photo-card");

if (photoCards.length) {
  const getGridPosition = (index) => {
    return {
      row: Math.floor(index / 3),
      col: index % 3,
    };
  };

  photoCards.forEach((card, activeIndex) => {
    card.addEventListener("mouseenter", () => {
      const activePosition = getGridPosition(activeIndex);

      photoCards.forEach((otherCard, otherIndex) => {
        const cover = otherCard.querySelector(".photo-cover");

        if (!cover) return;

        if (otherIndex === activeIndex) {
          cover.style.setProperty("--ripple-x", "0px");
          cover.style.setProperty("--ripple-y", "-105%");
          cover.classList.remove("is-rippling");
          return;
        }

        const otherPosition = getGridPosition(otherIndex);

        const distanceX = otherPosition.col - activePosition.col;
        const distanceY = otherPosition.row - activePosition.row;

        const moveX = distanceX * 10;
        const moveY = distanceY * 10;

        cover.style.setProperty("--ripple-x", `${moveX}px`);
        cover.style.setProperty("--ripple-y", `${moveY}px`);

        cover.classList.remove("is-rippling");

        requestAnimationFrame(() => {
          cover.classList.add("is-rippling");
        });
      });
    });

    card.addEventListener("mouseleave", () => {
      photoCards.forEach((otherCard) => {
        const cover = otherCard.querySelector(".photo-cover");

        if (!cover) return;

        cover.classList.remove("is-rippling");
        cover.style.setProperty("--ripple-x", "0px");
        cover.style.setProperty("--ripple-y", "0px");
      });
    });
  });
}


/* ================================
   Scroll Reveal
================================ */

const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}


/* ================================
   Back to top
================================ */

const backToTopButton = document.querySelector(".back-to-top");

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}


