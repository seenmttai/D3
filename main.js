import gsap from 'https://cdn.skypack.dev/gsap';
import ScrollTrigger from 'https://cdn.skypack.dev/gsap/ScrollTrigger';
import ScrollToPlugin from 'https://cdn.skypack.dev/gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const dots = gsap.utils.toArray('.dot');
gsap.set(dots, {
  transformOrigin: '50% 50%'
});

gsap.to(dots, {
  duration: 1,
  rotate: 360,
  repeat: -1,
  ease: 'none',
  stagger: {
    each: 0.2,
    repeat: -1
  }
});

window.addEventListener('load', () => {
  gsap.to('.loader', {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      document.querySelector('.loader').style.display = 'none';
    }
  });

  const textElements = document.querySelectorAll('.text-reveal');
  textElements.forEach(text => {
    const splitText = new SplitType(text, { types: 'chars' });
    gsap.from(splitText.chars, {
      opacity: 0,
      y: 100,
      rotateX: -90,
      stagger: 0.02,
      duration: 1,
      ease: 'back.out'
    });
  });
});

const graphics = document.querySelector('.hero-graphics');
gsap.to(graphics, {
  y: 100,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});

const sections = gsap.utils.toArray('section:not(#hero)');
sections.forEach(section => {
  gsap.from(section, {
    opacity: 0,
    y: 100,
    duration: 1,
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1
    }
  });
});

const themeCards = document.querySelectorAll('.theme-card');
themeCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      scale: 1.05,
      duration: 0.3
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      scale: 1,
      duration: 0.3
    });
  });
});

const logos = gsap.utils.toArray('.logo-item');
logos.forEach(logo => {
  gsap.from(logo, {
    opacity: 0,
    y: 50,
    duration: 1,
    scrollTrigger: {
      trigger: logo,
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1
    }
  });
});

const problemStatements = document.querySelectorAll('.problem-statement');
problemStatements.forEach(statement => {
  statement.addEventListener('mouseenter', () => {
    gsap.to(statement, {
      scale: 1.02,
      duration: 0.3
    });
  });

  statement.addEventListener('mouseleave', () => {
    gsap.to(statement, {
      scale: 1,
      duration: 0.3
    });
  });
});

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    const targetPosition = target.offsetTop;

    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: targetPosition,
        autoKill: false
      },
      ease: 'power2.inOut'
    });
  });
});

const particles = [];
const colors = ['#00F0FF', '#FFFFFF'];

for (let i = 0; i < 50; i++) {
  const particle = document.createElement('div');
  particle.style.position = 'absolute';
  particle.style.width = '2px';
  particle.style.height = '2px';
  particle.style.background = colors[Math.floor(Math.random() * colors.length)];
  particle.style.borderRadius = '50%';
  graphics.appendChild(particle);

  const coords = {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2
  };

  particles.push({ element: particle, coords });
}

function animateParticles() {
  particles.forEach(particle => {
    particle.coords.x += particle.coords.vx;
    particle.coords.y += particle.coords.vy;

    if (particle.coords.x < 0 || particle.coords.x > window.innerWidth) {
      particle.coords.vx *= -1;
    }
    if (particle.coords.y < 0 || particle.coords.y > window.innerHeight) {
      particle.coords.vy *= -1;
    }

    particle.element.style.transform = `translate(${particle.coords.x}px, ${particle.coords.y}px)`;
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();

const prizeCards = document.querySelectorAll('.prize-card');
prizeCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      scale: 1.05,
      duration: 0.3
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      scale: 1,
      duration: 0.3
    });
  });
});

const organizersContainer = document.querySelector('.organizers-container');
if (organizersContainer) {
  const organizerCards = gsap.utils.toArray('.organizer-card');
  if (organizerCards.length > 3) {
    gsap.to(organizersContainer, {
      x: () => -(organizersContainer.scrollWidth - organizersContainer.offsetWidth),
      ease: "none",
      scrollTrigger: {
        trigger: organizersContainer,
        start: "top center",
        end: "bottom center",
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  }
}

gsap.utils.toArray('.coordinator').forEach(coordinator => {
  gsap.from(coordinator, {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.5,
    scrollTrigger: {
      trigger: coordinator,
      start: "top 90%",
      toggleActions: "play none none none"
    }
  });
});

const heart = document.querySelector('.heart');
gsap.to(heart, {
  scale: 1.2,
  duration: 0.5,
  repeat: -1,
  yoyo: true
});