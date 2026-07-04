'use client';

import { useState } from 'react';
import { X, Send, Loader2, CheckCircle } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

interface Props {
  username: string;
  ownerName: string;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ContactModal({ username, ownerName }: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ senderName: '', senderEmail: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch(`${BASE}/public/u/${username}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? 'Erreur lors de l\'envoi.');
      }
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erreur lors de l\'envoi.');
      setStatus('error');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setStatus('idle');
    setForm({ senderName: '', senderEmail: '', message: '' });
    setErrorMsg('');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 rounded-full border border-white/10 hover:border-white/30 text-sm font-semibold transition-colors"
      >
        Me contacter
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="w-full max-w-md bg-[#0a1628] border border-white/10 rounded-2xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Contacter {ownerName}</h2>
              <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {status === 'success' ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <CheckCircle size={48} className="text-green-400" />
                <p className="text-lg font-semibold">Message envoyé !</p>
                <p className="text-sm text-gray-400">
                  {ownerName} recevra votre message par email et pourra vous répondre directement.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-4 px-6 py-2 rounded-full bg-blue-700 hover:bg-blue-600 text-sm font-semibold transition-colors"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Votre nom</label>
                  <input
                    type="text"
                    required
                    value={form.senderName}
                    onChange={(e) => setForm((f) => ({ ...f, senderName: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Votre email</label>
                  <input
                    type="email"
                    required
                    value={form.senderEmail}
                    onChange={(e) => setForm((f) => ({ ...f, senderEmail: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="jean@exemple.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    placeholder="Bonjour, je souhaite..."
                  />
                </div>
                {status === 'error' && (
                  <p className="text-sm text-red-400">{errorMsg}</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-700 hover:bg-blue-600 disabled:opacity-60 text-sm font-semibold transition-colors"
                >
                  {status === 'sending' ? (
                    <><Loader2 size={16} className="animate-spin" /> Envoi…</>
                  ) : (
                    <><Send size={16} /> Envoyer le message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}