"use client";

import { useActionState, useId } from "react";
import { enviarContrato } from "@/app/actions/contato";
import { ESTADO_INICIAL } from "@/lib/contato-tipos";

/**
 * design.md §8.5 — "Terminal de contrato".
 * Labels em mono com prefixo `>`, caret piscante no foco, erro sempre com
 * icone + texto (nunca so cor).
 *
 * v4 — saiu o que era de venda (tipo de servico e faixa de orcamento) e entrou
 * `empresa`, opcional. Quem escreve aqui agora e recrutador, nao cliente.
 */

const CAMPO =
  "w-full rounded-md border border-hairline bg-surface-3 px-4 py-3 text-text-hi " +
  "placeholder:text-text-dim transition-colors duration-[--dur-fast] " +
  "focus:border-magenta focus:outline-none focus:[box-shadow:var(--glow-magenta)]";

/** Degrau da cascata de entrada (`.entra`, globals.css). */
const ordem = (i: number) => ({ "--i": i }) as React.CSSProperties;

function Rotulo({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-center gap-2 font-mono text-xs tracking-[0.08em] text-text-dim"
    >
      <span aria-hidden="true" className="text-cyan">
        &gt;
      </span>
      {children}
    </label>
  );
}

function Erro({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 flex items-start gap-2 font-mono text-xs text-error">
      <span aria-hidden="true">▲</span>
      {children}
    </p>
  );
}

export function FormularioContrato() {
  const [estado, acao, pendente] = useActionState(enviarContrato, ESTADO_INICIAL);
  const id = useId();

  if (estado.status === "ok") {
    return (
      <div
        className="panel chamfer relative overflow-hidden p-8"
        role="status"
        aria-live="polite"
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-0.5 bg-cyan"
          style={{ boxShadow: "var(--glow-cyan)" }}
        />
        <p className="kicker text-cyan">Mensagem recebida</p>
        <p className="mt-4 font-mono text-sm text-text">
          Resposta em até 24h no canal que você deixou.
        </p>
      </div>
    );
  }

  return (
    <form action={acao} className="panel chamfer relative p-7 sm:p-8" noValidate>
      {/* Borda que acende quando o painel entra na tela (globals.css) */}
      <span aria-hidden="true" className="painel-liga" />
      {/* Honeypot — invisivel para gente, irresistivel para bot */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor={`${id}-isca`}>Não preencha este campo</label>
        <input id={`${id}-isca`} name="url_referencia" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="entra grid gap-6 sm:grid-cols-2" style={ordem(1)}>
        <div>
          <Rotulo htmlFor={`${id}-nome`}>seu_nome</Rotulo>
          <input
            id={`${id}-nome`}
            name="nome"
            required
            maxLength={120}
            autoComplete="name"
            className={CAMPO}
            placeholder="Como te chamo?"
            aria-invalid={estado.campo === "nome"}
          />
          {estado.campo === "nome" && <Erro>{estado.mensagem}</Erro>}
        </div>

        <div>
          <Rotulo htmlFor={`${id}-contato`}>canal_de_contato</Rotulo>
          <input
            id={`${id}-contato`}
            name="contato"
            required
            maxLength={160}
            autoComplete="email"
            className={CAMPO}
            placeholder="E-mail ou WhatsApp"
            aria-invalid={estado.campo === "contato"}
          />
          {estado.campo === "contato" && <Erro>{estado.mensagem}</Erro>}
        </div>
      </div>

      <div className="entra mt-6" style={ordem(2)}>
        <Rotulo htmlFor={`${id}-empresa`}>empresa_ou_time (opcional)</Rotulo>
        <input
          id={`${id}-empresa`}
          name="empresa"
          maxLength={160}
          autoComplete="organization"
          className={CAMPO}
          placeholder="De onde você fala"
          aria-invalid={estado.campo === "empresa"}
        />
        {estado.campo === "empresa" && <Erro>{estado.mensagem}</Erro>}
      </div>

      <div className="entra mt-6" style={ordem(3)}>
        <Rotulo htmlFor={`${id}-briefing`}>mensagem</Rotulo>
        <textarea
          id={`${id}-briefing`}
          name="briefing"
          required
          rows={5}
          maxLength={4000}
          className={`${CAMPO} resize-y`}
          placeholder="A vaga, o time e o que vocês precisam resolver"
          aria-invalid={estado.campo === "briefing"}
        />
        {estado.campo === "briefing" && <Erro>{estado.mensagem}</Erro>}
      </div>

      {/* Erro geral (sem campo associado) */}
      {estado.status === "erro" && !estado.campo && (
        <div role="alert" className="mt-6">
          <Erro>{estado.mensagem}</Erro>
        </div>
      )}

      {/* .entra fica no invólucro: no botão, anularia o hover que o levanta */}
      <div className="entra mt-8" style={ordem(4)}>
        <button
          type="submit"
          disabled={pendente}
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-md bg-magenta px-7 py-3.5 font-mono text-sm font-semibold tracking-[0.1em] text-void uppercase transition-all duration-[--dur-base] ease-[--ease-snap] hover:-translate-y-0.5 hover:[box-shadow:var(--glow-magenta)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-40 sm:w-auto"
        >
          {pendente ? (
            <>
              <span
                aria-hidden="true"
                className="size-3 animate-spin rounded-full border border-void border-t-transparent"
              />
              Processando...
            </>
          ) : (
            "Enviar mensagem"
          )}
        </button>
      </div>
    </form>
  );
}
