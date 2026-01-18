import { connectToDatabase } from '../server/utils/db.js';
import Post from '../server/models/Post.js';

const dummyPosts = [
    {
        title: "The Future of Interface",
        type: "text",
        content: "Interfaces are becoming less about buttons and more about intent. Kinetic typography bridges the gap between static text and emotion.",
        typography: { animationType: "slide", weight: "800" }
    },
    {
        title: "Oceanic Silence",
        type: "image",
        mediaUrl: "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?q=80&w=2000&auto=format&fit=crop",
        meta: { author: "Sarah Lee", likes: 1204 },
        typography: { animationType: "fade" }
    },
    {
        title: "Neon Nights",
        type: "image",
        mediaUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2000&auto=format&fit=crop",
        meta: { author: "CyberPunk", likes: 8900 },
        typography: { animationType: "distort" }
    },
    {
        title: "Minimalism",
        type: "text",
        content: "Less is more only when the 'less' is remarkably well crafted.",
        typography: { animationType: "none", weight: "300" }
    },
    {
        title: "Mountain Peak",
        type: "image",
        mediaUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop",
    },
    {
        title: "Urban Architecture",
        type: "image",
        mediaUrl: "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=2000&auto=format&fit=crop",
    },
    {
        title: "Fluid Motion",
        type: "text",
        content: "60fps is a requirement, not a suggestion. The web must feel like native code.",
        typography: { animationType: "slide" }
    }
];

export default async function handler(req, res) {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Seeding disabled in production' });
    }

    try {
        await connectToDatabase();
        
        // Clear existing (optional, usually good for dev)
        await Post.deleteMany({});
        
        // Insert dummy
        await Post.insertMany(dummyPosts);

        return res.status(200).json({ message: "Database seeded successfully", count: dummyPosts.length });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
