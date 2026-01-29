'use client'

import { motion } from 'framer-motion'
import { DollarSign, Package, ShoppingBag, Users } from 'lucide-react'

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display font-bold text-silver">Dashboard</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue', value: '₦45.2M', icon: DollarSign, color: 'text-gold' },
                    { label: 'Active Orders', value: '12', icon: ShoppingBag, color: 'text-teal' },
                    { label: 'Products', value: '8', icon: Package, color: 'text-blue-400' },
                    { label: 'Customers', value: '156', icon: Users, color: 'text-purple-400' },
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-xl font-bold text-silver">{stat.value}</span>
                        </div>
                        <h3 className="text-silver-dark text-sm">{stat.label}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="glass-card p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
                <p className="text-silver-dark">Recent activity chart would go here...</p>
            </div>
        </div>
    )
}
