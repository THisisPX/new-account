import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Save,
  Bell,
  Shield,
  DollarSign,
  Percent,
  Clock,
  Mail,
  Phone,
} from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    // 平台设置
    platformName: '三角洲租号',
    platformDescription: '专业、安全、高性能的游戏账号租赁平台',
    contactEmail: 'support@delta-rent.com',
    contactPhone: '400-888-8888',
    
    // 交易设置
    serviceFee: 6,
    minRentPrice: 10,
    minSellAmount: 50,
    depositPercent: 20,
    
    // 通知设置
    emailNotification: true,
    smsNotification: false,
    orderNotification: true,
    systemNotification: true,
    
    // 安全设置
    requirePhoneVerify: true,
    requireEmailVerify: false,
    enableSuperGuarantee: true,
    maxLoginAttempts: 5,
  });

  const handleSave = () => {
    console.log('保存设置:', settings);
    // 这里处理保存逻辑
    alert('设置已保存');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">系统设置</h1>
        <p className="text-gray-400 mt-1">管理平台各项配置参数</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Settings */}
        <Card className="bg-gray-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              平台设置
            </CardTitle>
            <CardDescription className="text-gray-400">
              配置平台基本信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">平台名称</Label>
              <Input
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">平台描述</Label>
              <Input
                value={settings.platformDescription}
                onChange={(e) => setSettings({ ...settings, platformDescription: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                联系邮箱
              </Label>
              <Input
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                联系电话
              </Label>
              <Input
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Transaction Settings */}
        <Card className="bg-gray-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              交易设置
            </CardTitle>
            <CardDescription className="text-gray-400">
              配置交易相关参数
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <Percent className="w-4 h-4" />
                服务费率 (%)
              </Label>
              <Input
                type="number"
                value={settings.serviceFee}
                onChange={(e) => setSettings({ ...settings, serviceFee: parseInt(e.target.value) })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">最低租赁价格 (元/小时)</Label>
              <Input
                type="number"
                value={settings.minRentPrice}
                onChange={(e) => setSettings({ ...settings, minRentPrice: parseInt(e.target.value) })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">最低出售哈佛币 (M)</Label>
              <Input
                type="number"
                value={settings.minSellAmount}
                onChange={(e) => setSettings({ ...settings, minSellAmount: parseInt(e.target.value) })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">押金比例 (%)</Label>
              <Input
                type="number"
                value={settings.depositPercent}
                onChange={(e) => setSettings({ ...settings, depositPercent: parseInt(e.target.value) })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-gray-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              通知设置
            </CardTitle>
            <CardDescription className="text-gray-400">
              配置消息通知选项
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">邮件通知</p>
                <p className="text-gray-500 text-sm">通过邮件发送重要通知</p>
              </div>
              <Switch
                checked={settings.emailNotification}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotification: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">短信通知</p>
                <p className="text-gray-500 text-sm">通过短信发送重要通知</p>
              </div>
              <Switch
                checked={settings.smsNotification}
                onCheckedChange={(checked) => setSettings({ ...settings, smsNotification: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">订单通知</p>
                <p className="text-gray-500 text-sm">订单状态变更时通知用户</p>
              </div>
              <Switch
                checked={settings.orderNotification}
                onCheckedChange={(checked) => setSettings({ ...settings, orderNotification: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">系统通知</p>
                <p className="text-gray-500 text-sm">接收系统维护和更新通知</p>
              </div>
              <Switch
                checked={settings.systemNotification}
                onCheckedChange={(checked) => setSettings({ ...settings, systemNotification: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-gray-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              安全设置
            </CardTitle>
            <CardDescription className="text-gray-400">
              配置账号安全选项
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">手机验证</p>
                <p className="text-gray-500 text-sm">注册时必须验证手机号</p>
              </div>
              <Switch
                checked={settings.requirePhoneVerify}
                onCheckedChange={(checked) => setSettings({ ...settings, requirePhoneVerify: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">邮箱验证</p>
                <p className="text-gray-500 text-sm">注册时必须验证邮箱</p>
              </div>
              <Switch
                checked={settings.requireEmailVerify}
                onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerify: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">超级质保</p>
                <p className="text-gray-500 text-sm">允许用户开启超级质保服务</p>
              </div>
              <Switch
                checked={settings.enableSuperGuarantee}
                onCheckedChange={(checked) => setSettings({ ...settings, enableSuperGuarantee: checked })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                最大登录尝试次数
              </Label>
              <Input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-primary text-black hover:bg-primary-dark px-8"
        >
          <Save className="w-4 h-4 mr-2" />
          保存设置
        </Button>
      </div>
    </div>
  );
}
