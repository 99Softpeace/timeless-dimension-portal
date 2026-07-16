'use client'

type Card = { number: string; expiryMonth: string; expiryYear: string; cvv: string; pin: string }

export default function V4PaymentFields({ paymentMethod, card, setCard, onMethodChange }: {
  paymentMethod: string
  card: Card
  setCard: (card: Card) => void
  onMethodChange: (method: string) => void
}) {
  return (
    <>
      {paymentMethod !== 'card' && (
        <button type='button' onClick={() => onMethodChange('card')} className='w-full rounded-xl border border-gray-200 p-4 text-left font-semibold text-slate-800 dark:border-slate-700 dark:text-white'>
          Pay with card
        </button>
      )}
      {paymentMethod === 'card' && (
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-gray-200 p-4 dark:border-slate-700">
          <input className="col-span-2 rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-900" placeholder="Card number" inputMode="numeric" autoComplete="cc-number" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} required />
          <input className="rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-900" placeholder="Expiry month (MM)" inputMode="numeric" autoComplete="cc-exp-month" value={card.expiryMonth} onChange={(e) => setCard({ ...card, expiryMonth: e.target.value })} required />
          <input className="rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-900" placeholder="Expiry year (YY)" inputMode="numeric" autoComplete="cc-exp-year" value={card.expiryYear} onChange={(e) => setCard({ ...card, expiryYear: e.target.value })} required />
          <input className="rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-900" placeholder="CVV" type="password" inputMode="numeric" autoComplete="cc-csc" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} required />
          <input className="rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-900" placeholder="Card PIN (if required)" type="password" inputMode="numeric" autoComplete="off" value={card.pin} onChange={(e) => setCard({ ...card, pin: e.target.value })} />
        </div>
      )}
      <label className={`block cursor-pointer rounded-xl border p-4 transition ${paymentMethod === 'bank_transfer' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'border-gray-200 dark:border-slate-700'}`}>
        <input type="radio" name="paymentMethodV4" value="bank_transfer" checked={paymentMethod === 'bank_transfer'} onChange={() => onMethodChange('bank_transfer')} className="mr-3" />
        <span className="font-semibold text-slate-800 dark:text-white">Pay by bank transfer</span>
        <p className="mt-1 pl-7 text-sm text-slate-500 dark:text-slate-400">Get a temporary Flutterwave account for this order.</p>
      </label>
    </>
  )
}
