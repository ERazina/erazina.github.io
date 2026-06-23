import { text } from "express";
import style from "antd/es/_util/wave/style.js";
import SendForm from "./sendForm.js";
export function initModal() {
    const modalOverlay = document.getElementById("modalOverlay");

    document.querySelectorAll(".open-modal").forEach((btn) => {
        btn.addEventListener("click", loadAndShowModal);
    });

    async function loadAndShowModal() {
        try {
            const response = await fetch("modal-content.html");
            if (!response.ok)
                throw new Error("Ошибка загрузки модального окна");

            const modalHTML = await response.text();
            modalOverlay.innerHTML = modalHTML;
            modalOverlay.classList.remove("hidden");
            document.body.style.overflow = "hidden";
            initModalEvents();
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Не удалось загрузить форму. Попробуйте позже.");
        }
    }

    function initModalEvents() {
        const closeBtn =
            modalOverlay.querySelector("#closeModalInner") ||
            modalOverlay.querySelector("#closeModal");
        if (closeBtn) {
            closeBtn.addEventListener("click", closeModal);
        }

        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        document.addEventListener("keydown", (e) => {
            if (
                e.key === "Escape" &&
                !modalOverlay.classList.contains("hidden")
            )
                closeModal();
        });

        const form = modalOverlay.querySelector("form");
        if (form) {
            SendForm();
        }
    }

    function closeModal() {
        modalOverlay.classList.add("hidden");
        modalOverlay.innerHTML = "";
        document.body.style.overflow = "";
    }
}

initModal();
