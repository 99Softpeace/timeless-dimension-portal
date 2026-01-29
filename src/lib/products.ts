export interface Product {
    id: string
    name: string
    slug: string
    price: number
    image: string
    model3d: string
    description: string
    isNew?: boolean
    isBestSeller?: boolean
    discount?: number
    category: string
    brand: string
    specs: {
        movement: string
        caseSize: string
        waterResistance: string
        strapMaterial: string
    }
}

export const allProducts: Product[] = [
    {
        id: '1',
        name: 'Heritage Classic',
        slug: 'heritage-classic',
        price: 250000,
        image: '/assets/images/heritage-classic-v2.png',
        model3d: '/assets/models/heritage-classic.glb',
        description: 'A timeless piece that embodies classic elegance. The Heritage Classic features a robust stainless steel case, a sapphire crystal face, and a genuine leather strap that ages beautifully over time. Perfect for the professional who values tradition.',
        isNew: true,
        category: 'classic',
        brand: 'Timeless',
        specs: {
            movement: 'Automatic',
            caseSize: '40mm',
            waterResistance: '50m',
            strapMaterial: 'Genuine Leather'
        }
    },
    {
        id: '2',
        name: 'Nigerian Pride',
        slug: 'nigerian-pride',
        price: 180000,
        image: '/assets/images/nigerian-pride-v2.png',
        model3d: '/assets/models/nigerian-pride.glb',
        description: 'Celebrating Nigerian heritage with modern craftsmanship. This limited edition timepiece incorporates traditional motifs into a sleek, modern design. A statement piece for those who wear their culture with pride.',
        isBestSeller: true,
        category: 'heritage',
        brand: 'Timeless',
        specs: {
            movement: 'Quartz',
            caseSize: '42mm',
            waterResistance: '30m',
            strapMaterial: 'Nylon NATO'
        }
    },
    {
        id: '3',
        name: 'Lagos Nights',
        slug: 'lagos-nights',
        price: 320000,
        image: '/assets/images/lagos-nights-v2.png',
        model3d: '/assets/models/lagos-nights.glb',
        description: 'Inspired by the vibrant energy of Lagos after dark. With luminescent markers and a deep midnight blue dial, this watch captures the pulse of the city that never sleeps.',
        discount: 15,
        category: 'modern',
        brand: 'Timeless',
        specs: {
            movement: 'Automatic Chronograph',
            caseSize: '44mm',
            waterResistance: '100m',
            strapMaterial: 'Stainless Steel Mesh'
        }
    },
    {
        id: '4',
        name: 'Golden Hour',
        slug: 'golden-hour',
        price: 280000,
        image: '/assets/images/golden-hour-v2.png',
        model3d: '/assets/models/golden-hour.glb',
        description: 'Capturing the magic of golden hour in Nigeria. The rose gold casing and sunburst dial radiate warmth and sophistication, making it the perfect accessory for special occasions.',
        category: 'luxury',
        brand: 'Timeless',
        specs: {
            movement: 'Swiss Quartz',
            caseSize: '38mm',
            waterResistance: '30m',
            strapMaterial: 'Rose Gold Plated'
        }
    },
    {
        id: '5',
        name: 'Abuja Elegance',
        slug: 'abuja-elegance',
        price: 220000,
        image: '/assets/images/abuja-elegance-v2.png',
        model3d: '/assets/models/abuja-elegance.glb',
        description: "Sophisticated design inspired by Nigeria's capital. Clean lines and a minimalist aesthetic define this watch, reflecting the modern architecture of Abuja.",
        category: 'classic',
        brand: 'Timeless',
        specs: {
            movement: 'Automatic',
            caseSize: '41mm',
            waterResistance: '50m',
            strapMaterial: 'Alligator Leather'
        }
    },
    {
        id: '6',
        name: 'Kano Heritage',
        slug: 'kano-heritage',
        price: 195000,
        image: '/assets/images/kano-heritage-v2.png',
        model3d: '/assets/models/kano-heritage.glb',
        description: 'Honoring the rich history of Kano. Earthy tones and a rugged design pay homage to the ancient city walls and the enduring spirit of the North.',
        category: 'heritage',
        brand: 'Timeless',
        specs: {
            movement: 'Mechanical Hand-Wound',
            caseSize: '43mm',
            waterResistance: '100m',
            strapMaterial: 'Canvas'
        }
    },
    {
        id: '7',
        name: 'Port Harcourt Pearl',
        slug: 'port-harcourt-pearl',
        price: 350000,
        image: '/assets/images/port-harcourt-pearl-v2.png',
        model3d: '/assets/models/port-harcourt-pearl.glb',
        description: 'Luxury timepiece inspired by the oil city. Featuring a mother-of-pearl dial and diamond markers, this watch is the epitome of opulence.',
        category: 'luxury',
        brand: 'Timeless',
        specs: {
            movement: 'Swiss Automatic',
            caseSize: '36mm',
            waterResistance: '50m',
            strapMaterial: 'Ceramic'
        }
    },
    {
        id: '8',
        name: 'Calabar Coast',
        slug: 'calabar-coast',
        price: 240000,
        image: '/assets/images/calabar-coast-v2.png',
        model3d: '/assets/models/calabar-coast.glb',
        description: 'Elegant design reflecting coastal beauty. The aquamarine dial and wave-patterned bezel evoke the serene waters of the Calabar river.',
        category: 'modern',
        brand: 'Timeless',
        specs: {
            movement: 'Automatic Diver',
            caseSize: '42mm',
            waterResistance: '200m',
            strapMaterial: 'Rubber'
        }
    },
]
