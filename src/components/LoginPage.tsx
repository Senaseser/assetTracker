import { type FormEvent, useState } from "react";

type LoginPageProps = {
  onLogin: (username: string, password: string) => Promise<void>;
};

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("loading");

    try {
      await onLogin(username, password);
      setStatus("success");
    } catch (requestError) {
      setStatus("idle");
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Giriş başarısız. Kullanıcı adı veya şifre hatalı."
      );
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-14">
      <div className="w-full max-w-270 grid gap-10 lg:grid-cols-2">
        <section className="p-6 flex flex-col gap-6 animate-[rise_700ms_ease-out_both]">
          <span className=" tracking-[0.25em] text-xs font-semibold text-[#8a5a12]">
            ASSET TRACKER
          </span>
          <h1 className="text-[clamp(2.4rem,2.2rem+1vw,3.2rem)] leading-tight m-0">
            Varlıklarını tek merkezden güvenle yönet.
          </h1>
          <p className="m-0 text-[#384040] text-[1.05rem]">
            Güvenli oturum aç, envanterini hızlıca kontrol et.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="m-0 text-2xl font-semibold">7/24</p>
              <p className="m-0  tracking-[0.12em] text-[0.65rem] text-[#6a7474]">
                İZLEME
              </p>
            </div>
            <div>
              <p className="m-0 text-2xl font-semibold">SQL</p>
              <p className="m-0  tracking-[0.12em] text-[0.65rem] text-[#6a7474]">
                ENVANTER
              </p>
            </div>
            <div>
              <p className="m-0 text-2xl font-semibold">API</p>
              <p className="m-0  tracking-[0.12em] text-[0.65rem] text-[#6a7474]">
                ENTEGRASYONU
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white/85 backdrop-blur-xl rounded-3xl p-10 shadow-[0_30px_80px_rgba(23,23,23,0.15)] border border-slate-900/10 animate-[rise_700ms_ease-out_both] [animation-delay:120ms]">
          <div>
            <h2 className="m-0 text-2xl font-semibold">Giriş yap</h2>
            <p className="m-0 text-[#5c6666]">Yetkili hesabınla devam et.</p>
          </div>

          <form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
            <label className="grid gap-2 font-medium text-[#1b1f1f]">
              <span>Kullanıcı adı</span>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="admin"
                autoComplete="username"
                required
                className="rounded-[14px] border border-slate-900/20 bg-[#f8f8f4] px-4 py-3 text-base transition focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/20"
              />
            </label>

            <label className="grid gap-2 font-medium text-[#1b1f1f]">
              <span>Şifre</span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
                autoComplete="current-password"
                required
                className="rounded-[14px] border border-slate-900/20 bg-[#f8f8f4] px-4 py-3 text-base transition focus:outline-none focus:border-amber-600 focus:ring-4 focus:ring-amber-600/20"
              />
            </label>

            {error ? (
              <p className="m-0 rounded-xl bg-red-500/10 px-4 py-3 font-medium text-red-700">
                {error}
              </p>
            ) : null}

            {status === "success" ? (
              <div className="rounded-xl bg-green-500/15 px-4 py-3 font-medium text-green-800">
                Giriş başarılı. Yönlendiriliyorsunuz.
              </div>
            ) : null}

            <button
              type="submit"
              className="rounded-full bg-linear-to-br from-amber-600 to-amber-400 px-5 py-3 text-base font-semibold text-[#1b1603] transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(217,119,6,0.25)] disabled:cursor-wait disabled:opacity-70 disabled:translate-y-0 disabled:shadow-none cursor-pointer"
              disabled={status === "loading"}
            >
              Giriş yap
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
