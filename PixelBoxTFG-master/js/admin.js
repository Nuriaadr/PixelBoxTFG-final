
document.addEventListener("DOMContentLoaded", () => {

    lucide.createIcons();

    document.getElementById("logoutBtnAdmin").addEventListener("click", function () {

        localStorage.removeItem("usuario");
        localStorage.removeItem("rol");

        window.location.href = "../index.html";
    });

});