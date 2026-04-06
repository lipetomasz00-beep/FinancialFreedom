export const m2mService = {
    getLoanOffers: async (amount: number, term: number, zrodlo: string, bik: string, category: string) => {
        try {
            const response = await fetch('/api/oferta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kwota: amount, okres: term, zrodlo, bik, category })
            });

            if (!response.ok) throw new Error('Błąd połączenia');
            const data = await response.json();

            return [{ name: "Oferta", url: data.link_docelowy }];
        } catch (error) {
            return [{ name: "mBank", url: "https://tmlead.pl/redirect/388900_3112" }];
        }
    }
};
