"use client";

import { useActionState, useId, useState, useTransition } from "react";
import { enviarContrato } from "@/app/actions/contato";
import {
  type EnviarPor,
  type EstadoContrato,
  ESTADO_INICIAL,
  LIMITES,
  linkWhatsApp,
  validarComum,
} from "@/lib/contato-tipos";

/**
 * design.md §8.5 — "Terminal de contrato".
 * Labels em mono com prefixo `>`, caret piscante no foco, erro sempre com
 * icone + texto (nunca so cor).
 *
 * v4 — saiu o que era de venda (tipo de servico e faixa de orcamento) e entrou
 * `empresa`, opcional. Quem escreve aqui agora e recrutador, nao cliente.
 *
 * `enviar_por` escolhe o caminho da mensagem:
 * - E-mail: o site envia pela Resend (action). Pede o e-mail da pessoa só para
 *   a resposta.
 * - WhatsApp: abre o WhatsApp dela numa conversa com o Hugo, com o texto
 *   pronto. O número dela chega junto, então não há campo de contato.
 */

const CAMPO =
  "w-full rounded-md border border-hairline bg-surface-3 px-4 py-3 text-text-hi " +
  "placeholder:text-text-dim transition-colors duration-[--dur-fast] " +
  "focus:border-magenta focus:outline-none focus:[box-shadow:var(--glow-magenta)]";

const OPCOES: Record<EnviarPor, { rotulo: string; botao: string }> = {
  email: { rotulo: "E-mail", botao: "Enviar mensagem" },
  whatsapp: { rotulo: "WhatsApp", botao: "Abrir no WhatsApp" },
};

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

const valorDe = (dados: FormData, campo: string) => String(dados.get(campo) ?? "").trim();

export function FormularioContrato() {
  const [estadoServidor, acao, pendente] = useActionState(enviarContrato, ESTADO_INICIAL);
  const id = useId();
  const [enviarPor, setEnviarPor] = useState<EnviarPor>("email");
  const [, iniciar] = useTransition();
  // Erro do caminho do WhatsApp, validado aqui mesmo (não passa pelo servidor).
  const [erroLocal, setErroLocal] = useState<EstadoContrato | null>(null);
  // Link aberto: fica na tela caso o navegador tenha bloqueado a nova aba.
  const [abriuWhatsApp, setAbriuWhatsApp] = useState<string | null>(null);

  const estado = erroLocal ?? estadoServidor;
  const opcao = OPCOES[enviarPor];

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
          Resposta em até 24h no e-mail que você deixou.
        </p>
      </div>
    );
  }

  return (
    <form
      // `action` fica para quem está sem JS (o WhatsApp, aí, sai por redirect
      // na action). Com JS o envio passa pelo onSubmit: o `action` do React
      // limpa o formulário depois de cada envio, e num erro de validação a
      // pessoa perderia o que escreveu.
      action={acao}
      onSubmit={(e) => {
        e.preventDefault();
        const dados = new FormData(e.currentTarget);

        if (enviarPor === "whatsapp") {
          const campos = {
            nome: valorDe(dados, "nome"),
            empresa: valorDe(dados, "empresa"),
            mensagem: valorDe(dados, "briefing"),
          };
          const erro = validarComum(campos);
          setErroLocal(erro);
          if (erro) return;
          const link = linkWhatsApp(campos);
          window.open(link, "_blank", "noopener,noreferrer");
          setAbriuWhatsApp(link);
          return;
        }

        setErroLocal(null);
        iniciar(() => acao(dados));
      }}
      className="panel chamfer relative p-7 sm:p-8"
      noValidate
    >
      {/* Borda que acende quando o painel entra na tela (globals.css) */}
      <span aria-hidden="true" className="painel-liga" />
      {/* Honeypot — invisivel para gente, irresistivel para bot */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor={`${id}-isca`}>Não preencha este campo</label>
        <input id={`${id}-isca`} name="url_referencia" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="entra grid gap-6" style={ordem(1)}>
        <div>
          <Rotulo htmlFor={`${id}-enviar-por`}>enviar_por</Rotulo>
          <div className="relative">
            <select
              id={`${id}-enviar-por`}
              name="enviar_por"
              value={enviarPor}
              onChange={(e) => {
                setEnviarPor(e.target.value as EnviarPor);
                setErroLocal(null);
                setAbriuWhatsApp(null);
              }}
              className={`${CAMPO} cursor-pointer appearance-none pr-10 font-mono text-sm [color-scheme:dark]`}
            >
              {(Object.keys(OPCOES) as EnviarPor[]).map((valor) => (
                <option key={valor} value={valor} className="bg-surface-3 text-text-hi">
                  {OPCOES[valor].rotulo}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 font-mono text-[0.6rem] text-cyan"
            >
              ▼
            </span>
          </div>
          {enviarPor === "whatsapp" && (
            <p className="mt-2 font-mono text-xs text-text-dim">
              Abre o seu WhatsApp numa conversa comigo, com a mensagem já escrita.
            </p>
          )}
        </div>

        <div>
          <Rotulo htmlFor={`${id}-nome`}>seu_nome</Rotulo>
          <input
            id={`${id}-nome`}
            name="nome"
            required
            maxLength={LIMITES.nome.max}
            autoComplete="name"
            className={CAMPO}
            placeholder="Como te chamo?"
            aria-invalid={estado.campo === "nome"}
          />
          {estado.campo === "nome" && <Erro>{estado.mensagem}</Erro>}
        </div>

        {/* Só o e-mail precisa do endereço da pessoa: é para onde vai a resposta */}
        {enviarPor === "email" && (
          <div>
            <Rotulo htmlFor={`${id}-email`}>seu_email (para a resposta)</Rotulo>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              inputMode="email"
              required
              maxLength={LIMITES.email.max}
              autoComplete="email"
              className={CAMPO}
              placeholder="voce@empresa.com"
              aria-invalid={estado.campo === "email"}
            />
            {estado.campo === "email" && <Erro>{estado.mensagem}</Erro>}
          </div>
        )}
      </div>

      <div className="entra mt-6" style={ordem(2)}>
        <Rotulo htmlFor={`${id}-empresa`}>empresa_ou_time (opcional)</Rotulo>
        <input
          id={`${id}-empresa`}
          name="empresa"
          maxLength={LIMITES.empresa.max}
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
          maxLength={LIMITES.mensagem.max}
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

      {abriuWhatsApp && (
        <p role="status" className="mt-6 font-mono text-xs text-cyan">
          WhatsApp aberto em outra aba.{" "}
          <a
            href={abriuWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-text-hi"
          >
            Não abriu? Toque aqui.
          </a>
        </p>
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
            opcao.botao
          )}
        </button>
      </div>
    </form>
  );
}
