function dbRaf(fn) {
  requestAnimationFrame(t => {
    requestAnimationFrame(t => {
      fn();
    });
  });
}

function delay(fn, t) {
  setTimeout(() => {
    fn();
  }, t);
}

function lock(e) {
  e.preventDefault();
}

const ul = document.querySelector("ul");
let ifOpen = false;
let locker = false;
const t = {
  x: undefined,
  y: undefined,
  scale: undefined,
  ratio: undefined,
  end: undefined
};

document.querySelectorAll(".dialog").forEach(dialog => {
  dialog.addEventListener("click", e => {
    const item = e.currentTarget;
    const img = item.children[0].children[0];
    const title = item.children[2];
    if (!ifOpen && !locker) {
      ifOpen = true;
      locker = true;
      title.style.display = "none";
      const start = item.getBoundingClientRect();
      const ratio = (t.ratio = img.getBoundingClientRect().width / img.getBoundingClientRect().height);
      item.classList.add("open");
      item.style.zIndex = 1;
      const end = (t.end = item.getBoundingClientRect());
      const moveX = (t.x = start.x - end.x);
      const moveY = (t.y = start.y - end.y);
      const scale = (t.scale = start.width / end.width);
      const h = (img.style.height = item.style.height = item.getBoundingClientRect().width / ratio + "px"); // 扩大后的高宽比一致
      item.style.transformOrigin = "0 0";
      item.style.transform = `translate(${moveX}px,${moveY}px) scale(${scale})`;

      dbRaf(function() {
        img.classList.add("animate");
        item.classList.add("animate");
        img.style.height = parseInt(h, 10) + 100 + "px"; // height放大效果
        item.style.height = "100vh";
        item.style.transform = "";
        item.style.overflow = "auto";
      });

      delay(function() {
        item.classList.remove("animate");
        img.classList.remove("animate");
        locker = false;
      }, 1000);
    } else if (!locker) {
      ifOpen = false;
      locker = true;
      item.classList.add("animate--out");
      img.classList.add("animate--out");
      window.addEventListener("wheel", lock, { passive: false });
      item.scrollTo({ top: 0, behavior: "smooth" });
      item.style.transform = `translate(${t.x}px,${t.y}px) scale(${t.scale})`;
      img.style.height = item.style.height = `${t.end.width / t.ratio}px`;
      title.style.display = "block";
      title.style.opacity = "0";
      // debugger

      delay(function() {
        window.removeEventListener("wheel", lock);
        item.classList.remove("open", "animate--out");
        img.classList.remove("animate--out");
        item.style.height = img.style.height = "260px";
        item.style.overflow = "hidden";
        item.style.transform = "";
        item.style.zIndex = "auto";
        title.style.opacity = "1";
        locker = false;
      }, 500);
    }
  });
});
