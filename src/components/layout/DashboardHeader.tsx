import React from 'react';
import { User, Bell, Settings, Shield } from 'lucide-react';

export function DashboardHeader({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg transform group-hover:scale-105 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ReturnShield
              </h1>
              <p className="text-xs text-gray-500">by ProtoHQ × CryptacoreAI</p>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">System Active</span>
            </div>

            <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 group">
              <Bell className="w-5 h-5 transform group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <button
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 group"
              onClick={onOpenSettings}
            >
              <Settings className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                JD
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Fraud Analyst</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}