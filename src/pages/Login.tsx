import React, { FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import netFlixLogo from "../asset/netflixlog.png";
import { useAuth } from "../common/auth";

export default function Login() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  async function authenticateUser(event: React.SyntheticEvent) {
    event.preventDefault();
    const { email, password } = event.target as typeof event.target & {
      email: HTMLInputElement;
      password: HTMLInputElement;
    };
    // console.log(email.value , password.value);

    try {
      await signIn(email.value, password.value);
    } catch (error) {
      console.log(error);
      const usernotele = document.querySelector(
        "#User-not-avail"
      ) as HTMLElement;
      usernotele.classList.remove("invisible");
    }

    console.log(user);
  }
  return (
    <>
      <header className="relative z-[1] w-56 bg-transparent">
        <img className=" h-full w-full" src={netFlixLogo} alt="" />
      </header>

      <main>
        <section
          className={`absolute top-0 min-h-screen w-full bg-[url('https://external-preview.redd.it/B6MrrY-dyD1lnvvrb2BCISx1xQwGx-e7pjm-qeXwAkE.jpg?auto=webp&s=ade83a5a759042ffed5324e5172c9a59a27aaaa9')] bg-cover `}
        ></section>

        <section className="absolute inset-0 bg-zinc-900/50 bg-gradient-to-b bg-cover"></section>

        <article className="relative mx-auto min-h-[70vh] w-[450px] rounded-lg bg-black/75 p-16">
          <h1 className="mb-4 text-4xl "> Sign In</h1>
          <section className="flex flex-col gap-2">
            <form
              onSubmit={authenticateUser}
              className="flex flex-col gap-2 text-gray-300"
            >
              <input
                className="rounded-md bg-zinc-500 p-2"
                type="email"
                name="email"
                id="email"
                placeholder="Username"
              />
              <input
                className="rounded-md bg-zinc-500 p-2"
                type="password"
                name="password"
                id="password"
                placeholder="password"
              />

              <button className="my-8 rounded-md bg-netflixRed p-2 font-semibold text-white">
                Sign In
              </button>
            </form>
            <p className=" invisible  bg-orange-500 p-2  rounded-md " id="User-not-avail">
              Invalid Username Or Password
            </p>

            <p >
              New to NetFlix? <Link to={"/signup"}> Signup Now</Link>
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
