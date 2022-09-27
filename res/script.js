class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem("notes")) || [];
    this.title = "";
    this.text = "";
    this.id = "";

    this.$form = document.querySelector("#form");
    this.$formButtons = document.querySelector("#form-buttons");
    this.$headerTitle = document.querySelector("#header-title");
    this.$noteTitle = document.querySelector("#note-title");
    this.$noteText = document.querySelector("#note-text");
    this.placeholder = document.querySelector("#placeholder");
    this.$notes = document.querySelector("#notes");
    this.closeBtn = document.querySelector(".note-close-btn");
    this.$formCloseButton = document.querySelector("#form-close-button");
    this.$modal = document.querySelector(".modal");
    this.$modalTitle = document.querySelector(".modal-title");
    this.$modalText = document.querySelector(".modal-text");
    this.$modalEditButton = document.querySelector(".modal-edit-btn");
    this.$noteCloseBtn = document.querySelector(".fa-times-circle");

    this.renderNotes();
    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener("click", (form) => {
      this.handleClick(form);
      this.clickNote(event);
      this.openModal(event);
      this.deleteNote(event);
    });

    this.$form.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      const hasNote = title || text;
      if (hasNote) {
        this.addNote({ title, text });
      }
    });

    this.$formCloseButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.closeForm();
    });

    this.$modalEditButton.addEventListener("click", (event) => {
      this.editNote(event);
    });
  }

  handleClick(form) {
    const title = this.$noteTitle.value;
    const text = this.$noteText.value;
    const hasNote = title || text;

    const isForm = this.$form.contains(form.target);
    if (isForm) {
      this.openForm();
    } else if (hasNote) {
      this.addNote({ title, text });
    } else {
      this.closeForm();
    }
  }

  openModal(event) {
    if (event.target.matches(".fa-times-circle")) return;

    if (event.target.closest(".note-wrapper")) {
      this.$modal.classList.toggle("open-modal");
      this.$modalTitle.value = this.title;
      this.$modalText.value = this.text;
    }
  }

  clickNote(event) {
    const $clickedNote = event.target.closest(".note-wrapper");
    if (!$clickedNote) return;
    const [$noteTitle, $noteText] = $clickedNote.children;
    this.title = $noteTitle.innerText;
    this.text = $noteText.innerText;
    this.id = $clickedNote.dataset.id;
  }

  openForm() {
    this.$form.classList.add("active");
    this.$formButtons.classList.add("active");
    this.$noteTitle.classList.add("active");
  }

  closeForm() {
    this.$form.classList.remove("active");
    this.$formButtons.classList.remove("active");
    this.$noteTitle.classList.remove("active");
    this.$noteTitle.value = "";
    this.$noteText.value = "";
  }

  addNote({ title, text }) {
    const newNote = {
      title,
      text,
      color: "grey",
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
    };

    this.notes = [...this.notes, newNote];
    this.renderNotes();
    this.$noteTitle.value = "";
    this.$noteText.value = "";
  }

  editNote(event) {
    const title = this.$modalTitle.value;
    const text = this.$modalText.value;
    this.notes = this.notes.map((note) =>
      note.id === Number(this.id) ? { ...note, title, text } : note
    );
    this.renderNotes();
    this.$modal.classList.toggle("open-modal");
  }

  deleteNote(event) {
    event.stopPropagation();

    if (event.target.matches(".fa-times-circle")) {
      const id = event.target.dataset.id;
      this.notes = this.notes.filter((note) => note.id !== Number(id));

      this.renderNotes();
    }
  }

  renderNotes() {
    this.displayNotes();
    this.saveNotes();
  }

  saveNotes() {
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0;
    if (hasNotes) {
    }
    this.$headerTitle.innerHTML = hasNotes
      ? `<i class="far fa-lightbulb"></i>Notes`
      : `<i class="fas fa-lightbulb"></i>Notes`;
    this.placeholder.style.display = hasNotes ? "none" : "flex";

    this.$notes.innerHTML = this.notes
      .map(
        (note) =>
          `<div class="note-wrapper" data-id="${note.id}">
              <div class="note-title">${note.title}</div>
              <div class="note-text">${note.text}</div>
              <div class="note-tools">
                <div class="note-close-btn"><i class="far fa-times-circle" data-id=${note.id}></i></div>
              </div>
          </div>
      `
      )
      .join("");
  }
}

new App();
