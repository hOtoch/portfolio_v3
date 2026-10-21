"use client";

import { useActionState, useEffect, useId, useState } from "react";

import { enviarLambe, verificarConvite } from "@/app/actions/depoimento";
import { LAMBE_INICIAL, LIMITES_LAMBE } from "@/lib/depoimento-tipos";

/**
 * A vaga "+ cole o seu" do muro. Só aparece para quem abriu o site por um
 * link de convite válido (`?convite=...`, gerado por `npm run convite`).
 * Sem convite não renderiza nada — quem só visita vê o muro e mais nada.
 *
 * O convite é conferido no servidor duas vezes: ao abrir (para mostrar a
 * vaga e preencher o negócio) e de novo no envio.
 */

type Convite = { token: string; cliente: string };

export function LambeNovo() {
  const [convite, setConvite] = useState<Convite | null>(null);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    // Lido do window, e não do useSearchParams: a home é estática e o
    // parâmetro só existe no link do convite.
    const token = new URLSearchParams(window.location.search).get("convite");
    if (!token) return;
    let vivo = true;
    verificarConvite(token).then((valido) => {
      if (vivo && valido) setConvite({ token, cliente: valido.cliente });
    });
    return () => {
      vivo = false;
    };
  }, []);

  if (!convite) return null;

  return (
    <li className="lambe-cola" style={{ "--i": 0 } as React.CSSProperties}>
      {aberto ? (
        <Formulario convite={convite} />
      ) : (
        <button type="button" onClick={() => setAberto(true)} className="lambe-vaga">
          <span className="text-3xl leading-none" aria-hidden="true">
            +
          </span>
          <span className="mt-3 font-mono text-xs tracking-[0.18em] uppercase">Cole o seu lambe</span>
          <span className="mt-2 font-mono text-[0.65rem] text-text-dim">convite de {convite.cliente}</span>
        </button>
      )}
    </li>
  );
}

function Formulario({ convite }: { convite: Convite }) {
  const [estado, acao, pendente] = useActionState(enviarLambe, LAMBE_INICIAL);
  // Campos controlados: o React 19 limpa o formulário depois de cada envio, e
  // um erro não pode apagar o que o cliente escreveu.
  const [nota, setNota] = useState(0);
  const [texto, setTexto] = useState("");
  const [nome, setNome] = useState("");
  const [negocio, setNegocio] = useState(convite.cliente);
  const id = useId();

  if (estado.status === "ok") {
    return (
      <div className="lambe lambe-osso" role="status" aria-live="polite">
        <span aria-hidden="true" className="lambe-fita lambe-fita-a" />
        <span aria-hidden="true" className="lambe-fita lambe-fita-b" />
        <p className="carimbo">Em análise</p>
        <p className="mt-5 font-display text-lg leading-snug font-semibold">Recebido, obrigado.</p>
        <p className="mt-2 text-sm leading-relaxed">
          Assim que eu conferir, ele aparece colado aqui no muro com as suas palavras.
        </p>
      </div>
    );
  }

  const erroDe = (campo: string) =>
    estado.campo === campo ? (
      <p className="mt-1 font-mono text-[0.68rem] text-[#b3123f]">▲ {estado.mensagem}</p>
    ) : null;

  return (
    <form action={acao} className="lambe lambe-osso" noValidate>
      <span aria-hidden="true" className="lambe-fita lambe-fita-a" />
      <span aria-hidden="true" className="lambe-fita lambe-fita-b" />

      {/* Honeypot — invisível para gente, irresistível para bot */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor={`${id}-site`}>Não preencha este campo</label>
        <input id={`${id}-site`} name="site_do_negocio" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="convite" value={convite.token} />
      <input type="hidden" name="nota" value={nota || ""} />

      <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase opacity-70">Lambe novo</p>

      <fieldset className="mt-3">
        <legend className="sr-only">Nota de 1 a 5</legend>
        <div className="lambe-nota flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNota(n)}
              aria-label={`${n} de 5`}
              aria-pressed={nota === n}
              className={`lambe-estrela ${n <= nota ? "opacity-100" : "opacity-25"}`}
            >
              ★
            </button>
          ))}
        </div>
        {erroDe("nota")}
      </fieldset>

      <label htmlFor={`${id}-texto`} className="sr-only">
        Depoimento
      </label>
      <textarea
        id={`${id}-texto`}
        name="texto"
        required
        rows={5}
        maxLength={LIMITES_LAMBE.textoMax}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Como foi trabalhar comigo? O que mudou no seu negócio?"
        aria-invalid={estado.campo === "texto"}
        className="lambe-caderno mt-3"
      />
      <p className="mt-1 text-right font-mono text-[0.6rem] opacity-60 tabular-nums">
        {texto.length}/{LIMITES_LAMBE.textoMax}
      </p>
      {erroDe("texto")}

      <div className="mt-3 grid gap-3">
        <div>
          <label htmlFor={`${id}-nome`} className="font-mono text-[0.6rem] tracking-[0.16em] uppercase opacity-70">
            Assinatura
          </label>
          <input
            id={`${id}-nome`}
            name="nome"
            required
            maxLength={80}
            autoComplete="name"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            aria-invalid={estado.campo === "nome"}
            className="lambe-linha"
          />
          {erroDe("nome")}
        </div>
        <div>
          <label htmlFor={`${id}-negocio`} className="font-mono text-[0.6rem] tracking-[0.16em] uppercase opacity-70">
            Negócio ou projeto
          </label>
          <input
            id={`${id}-negocio`}
            name="negocio"
            required
            maxLength={80}
            value={negocio}
            onChange={(e) => setNegocio(e.target.value)}
            aria-invalid={estado.campo === "negocio"}
            className="lambe-linha"
          />
          {erroDe("negocio")}
        </div>
      </div>

      {estado.status === "erro" && !estado.campo && (
        <p role="alert" className="mt-3 font-mono text-[0.68rem] text-[#b3123f]">
          ▲ {estado.mensagem}
        </p>
      )}

      <button
        type="submit"
        disabled={pendente}
        className="mt-5 w-full rounded-sm bg-[#1a1520] px-4 py-2.5 font-mono text-xs font-semibold tracking-[0.14em] text-[#f3eee4] uppercase transition-colors duration-[--dur-fast] hover:bg-magenta hover:text-void disabled:opacity-50"
      >
        {pendente ? "Passando cola..." : "Colar no muro"}
      </button>
    </form>
  );
}
