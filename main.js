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

  gsap.to("h1 em", { y: -6, rotation: -2, duration: 1.1, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1 });

  // The captain talks: the bubble pops in and cycles through lines.
  const lines = ["Ahoy! Need an app?", "I build it…", "…then I run it.", "Click me, I wave!"];
  const speechText = document.querySelector(".speech-text");
  let line = 0;
  gsap.set(".speech", { scale: 0, svgOrigin: "430 205" });
  gsap.to(".speech", { scale: 1, duration: .5, ease: "back.out(3)", delay: 2.4 });
  setInterval(() => {
    line = (line + 1) % lines.length;
    gsap.timeline()
      .to(".speech", { scale: 0, duration: .2, ease: "power2.in", svgOrigin: "430 205" })
      .add(() => { speechText.textContent = lines[line]; })
      .to(".speech", { scale: 1, duration: .45, ease: "back.out(3)", svgOrigin: "430 205" });
  }, 3400);

  // Clicking the captain makes him wave again.
  document.querySelector(".captain").addEventListener("click", () => {
    gsap.fromTo(".arm-wave", { rotation: 0 }, { rotation: 18, svgOrigin: "444 290", duration: .3, yoyo: true, repeat: 5, ease: "sine.inOut" });
    gsap.fromTo(".captain", { y: 0 }, { y: -14, duration: .18, yoyo: true, repeat: 1, ease: "power2.out" });
  });

  // Desktop: the hero scene and project cards tilt toward the pointer.
  if (window.matchMedia("(pointer: fine)").matches) {
    const tilt = (el, max) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5;
        const py = (e.clientY - r.top) / r.height - .5;
        gsap.to(el, { rotationY: px * max, rotationX: -py * max, transformPerspective: 900, duration: .4, ease: "power2.out" });
      });
      el.addEventListener("pointerleave", () => gsap.to(el, { rotationY: 0, rotationX: 0, duration: .6, ease: "elastic.out(1, .5)" }));
    };
    tilt(document.querySelector(".scene"), 8);
    document.querySelectorAll(".project").forEach((p) => tilt(p, 6));

    // Stickers can be peeled off and moved around the toolbox.
    if (window.Draggable) {
      gsap.registerPlugin(Draggable);
      document.querySelector(".stickers").classList.add("is-draggable");
      Draggable.create(".stickers li", {
        bounds: ".toolbox",
        onPress() { gsap.to(this.target, { scale: 1.15, boxShadow: "8px 8px 0 #14213D", duration: .15 }); },
        onRelease() { gsap.to(this.target, { scale: 1, boxShadow: "3px 3px 0 #14213D", duration: .4, ease: "bounce.out" }); },
      });
    }
  }

  // --- Scroll moments ---
  const pop = (targets, vars, trigger) =>
    gsap.from(targets, { ...vars, scrollTrigger: { trigger: trigger || targets, start: "top 85%", once: true } });

  pop(".tag", { y: 30, rotation: (i) => (i % 2 ? 6 : -6), opacity: 0, duration: .6, stagger: .08, ease: "back.out(2.5)" }, ".manifest");

  // Numbers on the tags count up the first time they come into view.
  document.querySelectorAll(".tag b").forEach((b) => {
    const m = b.textContent.match(/^(\$?)([\d.]+)(.*)$/);
    if (!m) return;
    const [, pre, num, post] = m;
    const n = { v: 0 };
    gsap.to(n, {
      v: +num, duration: 1.4, ease: "power2.out",
      scrollTrigger: { trigger: ".manifest", start: "top 85%", once: true },
      onUpdate: () => { b.textContent = pre + Math.round(n.v) + post; },
    });
  });

  // Workshop: the parcel rides the belt with the scroll and each machine
  // lights up as it passes.
  const stops = [120, 310, 500, 690, 880];
  const stages = ["idea", "sketch", "code", "v1.0", "live!"];
  const lampOn = ["#FF5A47", "#FFC933", "#FFC933", "#FFC933", "#FFC933"];
  const parcel = document.querySelector(".parcel");
  const parcelLabel = document.querySelector(".parcel-label");
  const stations = gsap.utils.toArray(".station");
  const lamps = gsap.utils.toArray(".st-lamp");
  let stage = -1;
  const setStage = (s) => {
    if (s === stage) return;
    stage = s;
    parcelLabel.textContent = stages[s];
    gsap.fromTo(".parcel-body", { y: 0 }, { y: -26, duration: .22, yoyo: true, repeat: 1, ease: "power2.out" });
    lamps.forEach((l, i) => gsap.to(l, { attr: { fill: i <= s ? lampOn[i] : "#fff" }, duration: .2 }));
    gsap.fromTo(stations[s], { scale: 1 }, { scale: 1.07, transformOrigin: "50% 100%", duration: .15, yoyo: true, repeat: 1 });
  };
  setStage(0);
  ScrollTrigger.create({
    trigger: ".factory", start: "top 75%", end: "bottom 45%", scrub: .6,
    onUpdate(self) {
      const x = stops[0] + (stops[4] - stops[0]) * self.progress;
      gsap.set(parcel, { attr: { transform: `translate(${x} 0)` } });
      gsap.set(".belt-top", { attr: { "stroke-dashoffset": -x } });
      let s = 0;
      stops.forEach((sx, i) => { if (x >= sx - 40) s = i; });
      setStage(s);
    },
  });
  gsap.to(".flame", { scaleY: 1.4, transformOrigin: "50% 0%", duration: .15, yoyo: true, repeat: -1 });
  gsap.fromTo(".pulse-line", { strokeDasharray: 90, strokeDashoffset: 90 }, { strokeDashoffset: -90, duration: 1.6, repeat: -1, ease: "none" });
  pop(".steps li", { y: 24, opacity: 0, duration: .5, stagger: .08, ease: "back.out(2)" }, ".steps");

  // A little boat sails down the captain's log as you read it.
  gsap.to(".log-boat", {
    y: () => document.querySelector(".log").offsetHeight - 40,
    ease: "none",
    scrollTrigger: { trigger: ".log-wrap", start: "top 60%", end: "bottom 60%", scrub: .5, invalidateOnRefresh: true },
  });
  gsap.to(".log-boat", { rotation: 8, duration: .8, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 100%" });

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
  gsap.to(".coconut", { rotation: 8, y: -4, duration: .9, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 100%" });

  // GSAP owns sticker transforms (Draggable writes inline transforms), so the
  // hand placed tilt and the hover nudge live here instead of in CSS.
  document.querySelectorAll(".stickers li").forEach((el, i) => {
    const r = tilts[i % tilts.length];
    gsap.set(el, { rotation: r });
    el.addEventListener("pointerenter", () => gsap.to(el, { rotation: -2 * r, scale: 1.12, duration: .35, ease: "back.out(3)" }));
    el.addEventListener("pointerleave", () => gsap.to(el, { rotation: r, scale: 1, duration: .35, ease: "back.out(3)" }));
  });
  pop(".stickers li", { scale: 0, opacity: 0, duration: .45, stagger: { each: .03, from: "random" }, ease: "back.out(3)" }, ".toolbox");

  gsap.fromTo(".beam", { rotation: -14 }, { rotation: 14, svgOrigin: "110 86", duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
  pop(".lighthouse", { y: 80, opacity: 0, duration: .8, ease: "back.out(1.6)" }, ".contact");
})();

// why me: cards pop in one by one when the section scrolls into view
(function () {
  var list = document.querySelector(".promises");
  if (!list || !("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  list.querySelectorAll(".promise").forEach(function (card, i) { card.style.setProperty("--i", i); });
  list.classList.add("anim");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { list.classList.add("in-view"); io.disconnect(); }
    });
  }, { threshold: 0.2 });
  io.observe(list);
})();
