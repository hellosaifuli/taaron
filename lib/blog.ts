export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  readTime: string
  sections: { heading?: string; body: string }[]
}

export const posts: BlogPost[] = [
  {
    slug: 'how-to-care-for-leather-goods',
    title: 'How to Care for Your Leather Goods: A Complete Guide',
    excerpt: 'A quality leather wallet or bag can last decades — but only with the right care. Here is everything you need to know to keep your leather looking its best.',
    date: '2025-04-10',
    category: 'Care & Maintenance',
    readTime: '6 min read',
    sections: [
      {
        body: 'Leather is one of the few materials that genuinely improves with age. A full-grain wallet carried daily for five years develops a patina — a warm, lived-in depth — that no synthetic material can replicate. But that transformation only happens when you take care of it properly. Neglect leather and it dries, cracks, and fades. Treat it right and it becomes a heirloom.',
      },
      {
        heading: 'Clean Before You Condition',
        body: 'Before applying any product, always clean the surface first. Use a soft, dry cloth to remove dust and surface dirt. For stubborn marks, dampen the cloth very slightly — just barely moist, never wet. Never use household cleaning sprays, alcohol wipes, or soap directly on leather. These strip the natural oils and leave the surface brittle.',
      },
      {
        heading: 'Conditioning: The Most Important Step',
        body: 'Leather is skin — it loses moisture over time, especially in Bangladesh\'s dry winter months or in air-conditioned offices. Conditioning restores that moisture and keeps the fibres supple. Apply a small amount of leather conditioner (beeswax-based is ideal) with a clean cloth in circular motions. Let it absorb for 10–15 minutes, then buff off any excess. Do this every 3–6 months, or whenever the leather starts to feel stiff.',
      },
      {
        heading: 'Protecting Against Moisture and Rain',
        body: 'Dhaka\'s monsoon season is leather\'s biggest enemy. If your bag or wallet gets soaked, do not panic — and do not put it near heat. Let it dry naturally at room temperature, stuffed with newspaper to hold its shape. Once dry, condition immediately. For prevention, a light coat of leather protector spray before the rains start is worth the effort.',
      },
      {
        heading: 'Storage Matters',
        body: 'When storing leather goods for a long period, keep them in a cool, dry place away from direct sunlight. Sunlight fades colour and dries out the surface faster than almost anything else. Store bags stuffed lightly with tissue or a dust bag (never plastic) to maintain their shape. Keep wallets flat rather than folded at an awkward angle.',
      },
      {
        heading: 'What to Avoid',
        body: 'A few things that ruin leather quickly: direct heat sources like heaters or hairdryers, prolonged exposure to sunlight, overstuffing wallets (this stretches the stitching), storing in plastic bags (traps moisture and causes mildew), and using petroleum-based products. When in doubt, less is more — quality leather needs very little intervention.',
      },
      {
        heading: 'The Taaron Promise',
        body: 'Every Taaron piece is made from full-grain or top-grain leather specifically chosen for its ability to age beautifully. With minimal care — clean occasionally, condition twice a year, store properly — your Taaron wallet or bag will outlast most things you own. That\'s not a marketing line. It\'s the nature of real leather.',
      },
    ],
  },
  {
    slug: 'full-grain-vs-genuine-leather',
    title: 'Full-Grain vs. Genuine Leather: Why the Difference Matters',
    excerpt: 'Not all leather is created equal. Understanding the difference between grades can save you from buying something that falls apart in six months.',
    date: '2025-04-03',
    category: 'Leather Education',
    readTime: '5 min read',
    sections: [
      {
        body: 'Walk into any shop in Dhaka selling leather goods and you\'ll see the word "leather" on almost everything. But there is a vast difference between a ৳500 wallet and a ৳3,000 one — and it starts with the hide itself. Here is what the labels actually mean.',
      },
      {
        heading: 'Full-Grain Leather: The Best',
        body: 'Full-grain leather is the top layer of the hide, with the natural grain intact. It has not been sanded or buffed to remove imperfections. This means it retains the hide\'s natural strength, breathability, and character — including small natural markings that become part of the story. Full-grain leather develops a patina over time: the more you use it, the more beautiful it becomes. It is the most durable grade and the most expensive. Every Taaron wallet and bag is made from full-grain leather.',
      },
      {
        heading: 'Top-Grain Leather: A Close Second',
        body: 'Top-grain leather is also from the upper layer, but it has been lightly sanded to remove surface imperfections, then given a finish coat. This makes it more uniform in appearance but slightly less durable and breathable than full-grain. It is still genuinely high quality — most premium fashion brands use top-grain. It will not develop quite the same patina, but it wears well.',
      },
      {
        heading: 'Genuine Leather: Misleading Label',
        body: '"Genuine leather" sounds like a quality mark. It is actually the opposite — it is one of the lowest grades of real leather. It is made from the leftover layers of the hide after the top grades have been cut away, bonded together and coated with a plastic-like finish. It looks fine when new but tends to peel and crack within a year or two of regular use. The word "genuine" simply means it contains some real leather — not that it is good quality.',
      },
      {
        heading: 'Bonded Leather: Avoid',
        body: 'Bonded leather is the particle board of the leather world: scraps and dust bonded together with polyurethane and embossed to look like real leather. It has almost none of the properties that make leather desirable. It peels, cracks, and deteriorates quickly. If a product is very cheap and says "leather" on the label, it is almost certainly bonded.',
      },
      {
        heading: 'How to Tell the Difference',
        body: 'The smell is the easiest test — real leather has a distinct, natural smell. Bonded and genuine leather often smell synthetic or chemical. Look at the edges: full-grain and top-grain have clean, consistent edges; bonded leather edges often look rough or layered. Press your thumb into it — real leather is warm and moulds slightly to the touch. And price is a rough guide: you cannot make a genuine full-grain leather wallet for ৳300.',
      },
      {
        heading: 'Why It Matters for Bangladeshi Buyers',
        body: 'Bangladesh\'s leather industry is large and skilled, but the local retail market is flooded with low-grade product marketed as premium. When you buy a Taaron piece, you receive a certificate of material: full-grain leather, strong linen thread, solid brass hardware. We believe you should know exactly what you are paying for.',
      },
    ],
  },
  {
    slug: 'minimalist-wallet-guide',
    title: 'The Minimalist Wallet: Why Carrying Less Changes Everything',
    excerpt: 'Most people carry a wallet stuffed with things they never use. Switching to a slim, minimalist wallet is one of those small changes with outsized impact on daily life.',
    date: '2025-03-27',
    category: 'Style & Lifestyle',
    readTime: '4 min read',
    sections: [
      {
        body: 'The average person carries a wallet with 6–12 cards, old receipts, loyalty cards for shops they visit twice a year, and notes they mean to clear out "this weekend." The result is a brick in the pocket, a stretched seam, and a posture problem from sitting on it eight hours a day. There is a better way.',
      },
      {
        heading: 'What You Actually Need',
        body: 'Think about the last seven days. How many cards did you actually use? For most people it is two or three: NID or passport, one debit or credit card, perhaps a work card. Everything else is theoretical — "in case I need it." The minimalist argument is that you carry an emergency kit every day for emergencies that almost never happen, at the cost of daily discomfort.',
      },
      {
        heading: 'The Case for Going Slim',
        body: 'A slim wallet — holding 3–6 cards and a few folded notes — sits flat in a front pocket and essentially disappears. No bulk in the jacket. No discomfort sitting at a desk. The practical bonus: you know exactly what you have with you. No rifling through seven cards to find the right one. No expired cards hiding at the back for months.',
      },
      {
        heading: 'Choosing the Right Slim Wallet',
        body: 'Not all slim wallets are equal. Look for full-grain leather (it will hold its shape far better than genuine leather), tight saddle stitching at the stress points, and a card slot design that grips cards firmly without making them impossible to remove. The Taaron Slim Wallet holds up to six cards and a few folded notes — enough for a full day without the bulk of a traditional bifold.',
      },
      {
        heading: 'Making the Switch',
        body: 'The transition takes one evening. Empty your current wallet completely. Sort into three piles: daily carry, occasional use, never needed. Put daily carry in the new wallet. Store occasional cards at home or in your bag. Throw away the never-needed pile. The first week feels strange — you will reach for cards that are not there. After two weeks, you will not miss them.',
      },
      {
        heading: 'The Leather Advantage',
        body: 'A slim wallet works best in leather because the material breaks in over time. In the first weeks, the card slots are firm — your cards stay put. Over months, the leather learns the exact shape of your cards and becomes perfectly calibrated to them. A nylon or synthetic slim wallet never does this. It stays the same on day one as on day one thousand.',
      },
    ],
  },
  {
    slug: 'leather-bags-dhaka-professional',
    title: 'The Best Leather Bag for Dhaka\'s Urban Professional',
    excerpt: 'Navigating Dhaka\'s streets, offices, and client meetings demands a bag that works as hard as you do. Here is what to look for.',
    date: '2025-03-18',
    category: 'Style & Lifestyle',
    readTime: '5 min read',
    sections: [
      {
        body: 'Dhaka is not a gentle city for bags. The commute — whether rickshaw, CNG, or car — is tough on any material. Monsoon rains arrive with little warning. Office culture has shifted: a bag must move from a formal board meeting to a co-working space to a client dinner without changing. The requirements are specific.',
      },
      {
        heading: 'Structure Over Softness',
        body: 'A structured leather bag — one that holds its shape when set down — reads as professional in a way that a slouchy canvas tote never will. It also protects your laptop and documents better. Look for a bag with an internal frame or thick enough leather to stand on its own. This matters more in Bangladesh\'s climate, where humidity can make softer bags lose shape over time.',
      },
      {
        heading: 'Size: The Goldilocks Problem',
        body: 'Too small and it does not fit a 15-inch laptop plus documents. Too large and it becomes a second piece of luggage. The ideal professional bag for the Dhaka context: fits a 13 or 15-inch laptop in a padded sleeve, has one or two external pockets for a phone and small items, and is narrow enough to carry under your arm in a crowded lift. Roughly 38–42cm wide and 28–32cm tall.',
      },
      {
        heading: 'Hardware and Zips',
        body: 'Brass or gunmetal hardware ages well; chrome-plated zinc does not. Check that zips run smoothly and are from a reputable manufacturer — a zip failure on an ৳8,000 bag is a betrayal. Magnetic closures are convenient but can affect cards and electronics if poorly positioned. Buckle closures are slower but virtually indestructible.',
      },
      {
        heading: 'The Monsoon Test',
        body: 'Full-grain leather handles light rain reasonably well, especially once conditioned — water beads on the surface rather than soaking in. For the heaviest rains, a separate rain cover is worth keeping in the bag. Avoid suede entirely for a daily Dhaka carry bag. Tan and darker browns hide incidental scuffs and marks far better than black, which shows dust.',
      },
      {
        heading: 'Strap Comfort for Long Days',
        body: 'A padded shoulder strap is not a luxury — it is a necessity if you are carrying a laptop for more than 20 minutes. Check that the strap is attached to the bag with double rivets or reinforced stitching at the D-ring, not just stitching through the leather body. This is the highest-stress point on any shoulder bag and where cheap construction fails first.',
      },
      {
        heading: 'An Investment Worth Making',
        body: 'A good leather bag bought at age 25 should still be in use at 40. The per-day cost of a ৳7,000 leather bag over 10 years is less than ৳2 — far cheaper than replacing a canvas or synthetic bag every two or three years. Dhaka\'s professional culture also reads quality: a well-made leather bag signals attention to detail in a way that matters in client meetings and boardrooms.',
      },
    ],
  },
  {
    slug: 'why-real-leather-outlasts-synthetic',
    title: 'Why Real Leather Outlasts Every Synthetic Alternative',
    excerpt: 'Fast fashion gave us cheap alternatives to leather. Here is why none of them come close — and why the economics of real leather make more sense than they first appear.',
    date: '2025-03-10',
    category: 'Leather Education',
    readTime: '5 min read',
    sections: [
      {
        body: 'The argument against real leather usually starts with price. A genuine leather wallet costs three to five times more than a synthetic one. But that framing misses how the two actually perform over time. Cheap synthetic leather is not cheaper — it just distributes the cost differently, making you pay again sooner.',
      },
      {
        heading: 'The Lifespan Gap',
        body: 'A quality full-grain leather wallet, used daily and given basic care, lasts 10–25 years. A PU or synthetic leather wallet begins to crack and peel within 1–3 years under the same conditions. A canvas wallet holds its shape for perhaps 2–4 years before the fabric thins and the stitching frays. The math: one leather wallet at ৳2,500 vs. six synthetic wallets at ৳500 over 15 years — the leather is cheaper.',
      },
      {
        heading: 'How Leather Responds to Use',
        body: 'This is the key difference that no synthetic material replicates: real leather responds to use. The fibres compress and mould to the exact shape of your body and your contents. A wallet that has been in a jacket pocket for five years fits that pocket perfectly. A bag carried on a left shoulder shapes itself subtly to how you carry it. Synthetics do not do this — they stay rigid until they fail.',
      },
      {
        heading: 'Breathability in Bangladesh\'s Climate',
        body: 'This is practically important in a hot, humid climate. Full-grain leather breathes — it allows air circulation and absorbs and releases moisture rather than trapping it. This means less sweating against a leather wallet in your pocket, less odour over time, and better condition of the items inside. PU and vinyl leather trap heat and moisture completely.',
      },
      {
        heading: 'The Environmental Angle',
        body: 'Leather from responsibly managed cattle is a by-product of the food industry — the hide would otherwise be waste. A leather bag that lasts 20 years has a fraction of the environmental footprint of six synthetic bags over the same period, especially when synthetic leathers are petroleum-based plastics that do not biodegrade. This is a nuanced area, but longevity is the most honest environmental metric.',
      },
      {
        heading: 'Buying Smart in Bangladesh',
        body: 'Bangladesh produces some of the best leather in the world — the country is a major global exporter of finished leather. But most of the premium product is exported, and the domestic retail market is saturated with low-grade goods. Taaron exists to change that: to make genuine full-grain leather goods available to Bangladeshi buyers at honest prices, with full transparency about what you are buying.',
      },
    ],
  },
]

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
