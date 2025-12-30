import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/* Fade up on load */
export const fadeUp = (selector, delay = 0) => {
  gsap.fromTo(
    selector,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      delay,
      ease: "power3.out",
    }
  )
}

/* Scroll fade up */
export const scrollFadeUp = (selector) => {
  gsap.fromTo(
    selector,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: selector,
        start: "top 85%",
      },
    }
  )
}

/* Scroll stagger cards */
export const scrollStagger = (selector) => {
  gsap.fromTo(
    selector,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: selector,
        start: "top 85%",
      },
    }
  )
}
