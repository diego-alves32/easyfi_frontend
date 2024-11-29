document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;

      const verificaLogin = await login(email, senha);

      if (verificaLogin.success) {
        localStorage.setItem("usuario", JSON.stringify(verificaLogin.usuario));

        const dados = JSON.parse(localStorage.getItem("usuario"));

        window.location.href = "./Dashboard/dashboard.html";
      } else {
        document.getElementById("result_alert").style.display = "block";
        document.getElementById("result_alert").style.color = "red";
        document.getElementById("result_alert").style.textAlign = "center";
        document.getElementById("result_alert").innerText =
          "Ops... Usuário ou senha não conferem. Tente novamente.";
      }
    });
  }

  const formRegistro = document.getElementById("formRegistro");
  if (formRegistro) {
    formRegistro.addEventListener("submit", async function (e) {
      e.preventDefault();

      const nomeUsuario = document.getElementById("nomeUsuario").value;
      const emailUsuario = document.getElementById("emailUsuario").value;
      const senhaUsuario = document.getElementById("senhaUsuario").value;
      const confirmaSenha = document.getElementById("confirmaSenha").value;
      if (senhaUsuario == confirmaSenha) {
        const response = await register(
          nomeUsuario,
          emailUsuario,
          senhaUsuario
        );

        console.log(response.status);

        switch (response.status) {
          case 201:
            document.getElementById("result_alert").style.display = "block";
            document.getElementById("result_alert").style.color = "green";
            document.getElementById("result_alert").innerText =
              "Usuário cadastrado! Indo para Login...";
            setTimeout(() => {
              window.location.href = "./";
            }, 3000); /*  */
            break;
          case 404:
            document.getElementById("result_alert").style.display = "block";
            document.getElementById("result_alert").style.color = "red";
            document.getElementById("result_alert").innerText =
              "Ops... Esse email já está cadastrado";
            break;
          default:
            document.getElementById("result_alert").style.display = "block";
            document.getElementById("result_alert").style.color = "red";
            document.getElementById("result_alert").innerText =
              "Ops... Ocorreu um erro inesperado";
        }
      } else {
        document.getElementById("result_alert").style.display = "block";
        document.getElementById("result_alert").style.color = "red";
        document.getElementById("result_alert").innerText =
          "Ops... Ocorreu um erro inesperado";
      }
    });
  }
});

async function login(email, senha) {
  try {
    const response = await fetch(
      "https://easy-fi-eight.vercel.app/users/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}

async function register(nome, email, senha) {
  try {
    const response = await fetch(
      "https://easy-fi-eight.vercel.app/users/criarUsuario",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      }
    );

    const data = await response.json();

    return { status: response.status, data };
  } catch (error) {
    console.error(error);
  }
}
