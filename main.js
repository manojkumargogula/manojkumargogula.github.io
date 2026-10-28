(() => {
  document.getElementById("year").textContent = new Date().getFullYear();

  // Hand-placed tilt for each sticker so the toolbox looks stuck on by hand.
  const tilts = [-4, 3, -2, 5, -3, 2, -5, 4, -1, 3];
  document.querySelectorAll(".stickers li").forEach((el, i) => {
    el.style.setProperty("--r", tilts[i % tilts.length] + "deg");
  });

  // Waves: a wide sine strip that slides one wavelength and loops.
  const WAVELEN = 100;
  function wavePath(baseY, amp) {
    let d = `M${-WAVELEN} ${baseY}`;
    for (let x = -WAVELEN; x < 600 + WAVELEN; x += WAVELEN) {
      d += ` q${WAVELEN / 4} ${-amp} ${WAVELEN / 2} 0 t${WAVELEN / 2} 0`;
    }
    return d + ` L${600 + WAVELEN} 480 L${-WAVELEN} 480 Z`;
  }
  document.getElementById("wave-back-path").setAttribute("d", wavePath(384, 14));
  document.getElementById("wave-front-path").setAttribute("d", wavePath(414, 16));

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.gsap) return;

  gsap.registerPlugin(ScrollTrigger);

  // --- Hero: cargo gets loaded, captain pops up, then the sea comes alive ---
  const load = gsap.timeline({ defaults: { ease: "bounce.out" } });
  load
    .from(".h1-line", { y: 40, opacity: 0, duration: .6, stagger: .15, ease: "back.out(2)" })
    .from(".eyebrow, .lede, .hero-actions", { y: 20, opacity: 0, duration: .5, stagger: .08, ease: "power2.out" }, "-=.3")
    .from(".cloud", { opacity: 0, scale: .4, transformOrigin: "50% 50%", duration: .6, stagger: .1, ease: "back.out(3)" }, 0.2)
    .from(".captain", { y: 70, opacity: 0, duration: .7, ease: "back.out(2.4)" }, 0.4)
    .from(".crate[data-row='1']", { y: -320, opacity: 0, duration: .9, stagger: .12 }, 0.7)
    .from(".crate[data-row='2']", { y: -320, opacity: 0, duration: .9, stagger: .12 }, 1.05)
    .from(".crate[data-row='3']", { y: -320, opacity: 0, duration: 1 }, 1.4)
    .from(".flag", { scaleX: 0, transformOrigin: "0% 50%", duration: .5, ease: "back.out(3)" }, 1.8);

  // ambient loops
  gsap.to(".ship", { y: 7, rotation: 1.6, svgOrigin: "300 380", duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut" });
  gsap.to(".wave-back", { x: -WAVELEN, duration: 3.4, repeat: -1, ease: "none" });
  gsap.fromTo(".wave-front", { x: -WAVELEN }, { x: 0, duration: 2.4, repeat: -1, ease: "none" });
  gsap.to(".wheel", { rotation: 50, svgOrigin: "392 300", duration: 1.8, yoyo: true, repeat: -1, ease: "sine.inOut" });
  gsap.to(".arm-wave", { rotation: 18, svgOrigin: "444 290", duration: .35, yoyo: true, repeat: 5, ease: "sine.inOut", repeatDelay: 0, delay: 2.2 });
  gsap.timeline({ repeat: -1, repeatDelay: 3.2, delay: 2.6 })
    .to(".eyes", { scaleY: .1, transformOrigin: "50% 50%", duration: .08 })
    .to(".eyes", { scaleY: 1, duration: .1 });
  gsap.to(".sun-rays", { rotation: 360, svgOrigin: "0 0", duration: 24, repeat: -1, ease: "none" });
  gsap.to(".flag", { skewY: 6, transformOrigin: "0% 50%", duration: .5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2.3 });
  gsap.to(".gull-wings", { scaleY: -.6, transformOrigin: "50% 100%", duration: .3, yoyo: true, repeat: -1, ease: "sine.inOut" });
  gsap.to(".gull", { x: 140, y: -40, duration: 9, yoyo: true, repeat: -1, ease: "sine.inOut" });
  document.querySelectorAll(".cloud").forEach((c) => {
    gsap.to(c, { x: +c.dataset.drift, duration: 6 + Math.random() * 3, yoyo: true, repeat: -1, ease: "sine.inOut" });
  });

  // Clicking the captain makes him wave again.
  document.querySelector(".captain").addEventListener("click", () => {
    gsap.fromTo(".arm-wave", { rotation: 0 }, { rotation: 18, svgOrigin: "444 290", duration: .3, yoyo: true, repeat: 5, ease: "sine.inOut" });
  });

  // --- Scroll moments ---
  const pop = (targets, vars, trigger) =>
    gsap.from(targets, { ...vars, scrollTrigger: { trigger: trigger || targets, start: "top 85%", once: true } });

  pop(".tag", { y: 30, rotation: (i) => (i % 2 ? 6 : -6), opacity: 0, duration: .6, stagger: .08, ease: "back.out(2.5)" }, ".manifest");

  document.querySelectorAll(".bubble").forEach((b) =>
    pop(b, { scale: .3, opacity: 0, transformOrigin: "20% 100%", duration: .6, ease: "back.out(2.6)" })
  );

  // service containers get craned in and land with a thud
  pop(".container", {
    y: -220, rotation: (i) => [-10, 8, -6, 11][i], opacity: 0,
    duration: 1, stagger: .14, ease: "bounce.out",
  }, ".containers");

  document.querySelectorAll(".log-entry").forEach((e) =>
    pop(e.querySelector(".log-card"), { x: 60, opacity: 0, duration: .7, ease: "back.out(1.6)" }, e)
  );

  pop(".project", { y: 60, opacity: 0, duration: .7, stagger: .1, ease: "back.out(1.8)" }, ".projects");

  pop(".stickers li", { scale: 0, opacity: 0, duration: .45, stagger: { each: .03, from: "random" }, ease: "back.out(3)" }, ".toolbox");

  gsap.fromTo(".beam", { rotation: -14 }, { rotation: 14, svgOrigin: "110 86", duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
  pop(".lighthouse", { y: 80, opacity: 0, duration: .8, ease: "back.out(1.6)" }, ".contact");
})();
