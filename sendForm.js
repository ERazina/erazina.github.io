import { message } from "antd";
import style from "antd/es/affix/style";
import { stringify } from "postcss";

export default function SendForm() {
    const form = document.getElementById("modalForm");
    if (!form) return;

    const feedback = form.querySelector("#contact-feedback");
    const button = form.querySelector("#contact-submit");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // 🛡 honeypot
        if (form.website && form.website.value) return;

        const payload = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            message: form.message.value.trim(),
        };

        // 🧠 простая валидация
        if (!payload.name || !payload.email) {
            showMessage("Заполни все поля", "error");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                "https://script.google.com/macros/s/AKfycby-REbAkG8c0J642kYIiJbcx3b3zKzd9-Cl1HAevJ3Cn5iHfsmb5KhwAm9zMe3iah0d/exec",
                {
                    method: "POST",
                    body: JSON.stringify(payload),
                },
            );

            if (!res.ok) throw new Error("Network error");

            showMessage("Заявка отправлена 🚀", "success");
            form.reset();
        } catch (err) {
            showMessage("Ошибка отправки. Попробуй позже", "error");
        } finally {
            setLoading(false);
        }
    });

    function setLoading(state) {
        button.disabled = state;
        button.innerText = state ? "Отправка..." : "Отправить заявку";
    }

    function showMessage(text, type) {
        feedback.classList.remove("hidden");

        feedback.textContent = text;

        feedback.style.color = type === "success" ? "#4ade80" : "#f87171";
    }
}
