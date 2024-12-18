dayjs.extend(window.dayjs_plugin_objectSupport);

class Calendar {
  constructor(data = {}) {
    data = {
      colors: {},
      aboves: {},
      belows: {},
      end_date: dayjs(),
      ...data,
    };

    this.start_date = dayjs(data.start_date);
    this.end_date = dayjs(data.end_date);

    let { colors, aboves, belows } = data;

    let dates = [];
    let current = this.start_date;
    while (current <= this.end_date) {
      dates.push(current);
      current = current.add(1, "day");
    }

    this.components = {};
    for (
      let month_id = this.start_date.month();
      month_id <= this.end_date.month();
      month_id++
    ) {
      let month = document.createElement("div");
      month.classList.add("month");

      let header = document.createElement("div");
      header.classList.add("header");
      header.innerHTML = `
        <img src='./assets/undo.svg' class='icon prev'>
        ${dayjs().month(month_id).format("MMMM YYYY")}
        <img src='./assets/redo.svg' class='icon next'>
      `;

      let grid = document.createElement("div");
      grid.classList.add("grid");
      grid.innerHTML = `
          <div class="day">Monday</div>
          <div class="day">Tuesday</div>
          <div class="day">Wednesday</div>
          <div class="day">Thursday</div>
          <div class="day">Friday</div>
          <div class="day">Saturday</div>
          <div class="day">Sunday</div>
      `;

      let offset = dayjs().month(month_id).date(1).day();

      if (offset === 0) offset = 7;

      grid.innerHTML +=
        `<div class="date-container"></div>`.repeat(offset - 1) +
        dates
          .filter((d) => d.month() === month_id)
          .map((d) => {
            let s = d.format("YYYY-MM-DD");
            return `<div class="date-container" style="${colors[s] ? "background-color: " + colors[s] + ";" : ""}">
                <span class="above">${aboves[s] || ""}</span>
                <div class="date">${d.date()}</div>
                <hr/>
                <span class="below">${belows[s] || ""}</span>
              </div>`;
          })
          .join("");

      month.appendChild(header);
      month.appendChild(grid);
      this.components[month_id] = month;
    }
  }

  render(render_month) {
    if (render_month == null) render_month = dayjs().month();
    if (
      render_month < this.start_date.month() ||
      render_month > this.end_date.month()
    ) {
      return;
    }
    for (let component in this.components) {
      if (render_month === +component) {
        this.components[component].classList.add("active");
      } else {
        this.components[component].classList.remove("active");
      }

      document.body.appendChild(this.components[component]);
    }

    document.querySelector(".active .prev").addEventListener("click", () => {
      this.render(render_month - 1);
    });

    document.querySelector(".active .next").addEventListener("click", () => {
      this.render(render_month + 1);
    });
  }
}
