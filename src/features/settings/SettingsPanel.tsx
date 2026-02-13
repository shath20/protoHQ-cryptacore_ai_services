
import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

import { RotateCcw, Save, Shield, Settings } from 'lucide-react';

export function SettingsPanel({ onClose }: { onClose?: () => void }) {
    const { settings, updateSettings, resetSettings } = useSettings();

    const handleThresholdChange = (key: keyof typeof settings, value: number) => {
        updateSettings({ [key]: value });
    };

    const handleToggleChange = (key: keyof typeof settings, value: boolean) => {
        updateSettings({ [key]: value });
    };

    return (
        <Card className="w-full max-w-2xl mx-auto border-2 border-gray-200 shadow-xl bg-white">
            <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-xl text-gray-800">
                        <Settings className="w-6 h-6 mr-2 text-blue-600" />
                        Risk Configuration
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={resetSettings} title="Reset to defaults">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset
                        </Button>
                        {onClose && (
                            <Button onClick={onClose} size="sm">
                                Done
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8 p-6">

                {/* Risk Thresholds Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold text-gray-700">Risk Thresholds</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>High Risk Threshold (Current: {settings.highRiskThreshold})</Label>
                                <span className="text-sm text-gray-500">Above this score is High Risk</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.highRiskThreshold}
                                onChange={(e) => handleThresholdChange('highRiskThreshold', Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                            />
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>0</span>
                                <span>100</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label>Medium Risk Threshold (Current: {settings.mediumRiskThreshold})</Label>
                                <span className="text-sm text-gray-500">Above this score is Medium Risk</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={settings.mediumRiskThreshold}
                                onChange={(e) => handleThresholdChange('mediumRiskThreshold', Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Automation Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                        <Settings className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-700">Automation Rules</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="space-y-0.5">
                                <Label className="text-base">Auto-Flag Threshold</Label>
                                <p className="text-sm text-gray-500">Automatically flag comments with score above this value</p>
                            </div>
                            <input
                                type="number"
                                value={settings.autoFlagThreshold}
                                onChange={(e) => handleThresholdChange('autoFlagThreshold', Number(e.target.value))}
                                className="w-20 p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none hover:border-gray-300"
                                min="0"
                                max="100"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="space-y-0.5">
                                <Label className="text-base">AI Pattern Detection</Label>
                                <p className="text-sm text-gray-500">Enable advanced AI writing pattern analysis</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.enableAiDetection}
                                onChange={(e) => handleToggleChange('enableAiDetection', e.target.checked)}
                                className="w-5 h-5 accent-blue-600"
                            />
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
