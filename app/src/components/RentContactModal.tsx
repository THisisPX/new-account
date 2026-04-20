import { useState } from 'react';
import { X, Check, Shield, FileText, AlertTriangle, MessageCircle, Users, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface RentContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountInfo?: {
    id: string;
    name: string;
    price: number;
    deposit: number;
  };
}

export default function RentContactModal({ isOpen, onClose, accountInfo }: RentContactModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [activeTab, setActiveTab] = useState<'wechat-work' | 'official'>('wechat-work');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-primary p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/30 transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
          <h2 className="text-2xl font-bold text-black mb-2">联系租赁</h2>
          <p className="text-black/70 text-sm">扫码添加客服，完成账号租赁</p>
        </div>

        <div className="p-6 space-y-6">
          {/* 账号信息 */}
          {accountInfo && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-primary" />
                租赁账号信息
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400">账号编号</p>
                  <p className="text-primary font-mono">{accountInfo.id}</p>
                </div>
                <div>
                  <p className="text-gray-400">账号名称</p>
                  <p className="text-white">{accountInfo.name}</p>
                </div>
                <div>
                  <p className="text-gray-400">租赁价格</p>
                  <p className="text-primary font-bold">¥{accountInfo.price}/小时</p>
                </div>
                <div>
                  <p className="text-gray-400">押金</p>
                  <p className="text-white">¥{accountInfo.deposit}</p>
                </div>
              </div>
            </div>
          )}

          {/* 租赁说明 */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              租赁说明
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>扫码添加客服为好友，说明您要租赁的账号</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>客服将为您提供详细的租赁流程指导</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>完成支付后，客服将立即发送账号信息</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>租赁期间如有问题，可随时联系客服处理</span>
              </li>
            </ul>
          </div>

          {/* 联系方式选择 */}
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              选择联系方式
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab('wechat-work')}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  activeTab === 'wechat-work'
                    ? 'bg-primary/20 border-primary'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Users className={`w-8 h-8 ${activeTab === 'wechat-work' ? 'text-primary' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${activeTab === 'wechat-work' ? 'text-primary' : 'text-gray-400'}`}>
                    企业微信
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('official')}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  activeTab === 'official'
                    ? 'bg-primary/20 border-primary'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <MessageCircle className={`w-8 h-8 ${activeTab === 'official' ? 'text-primary' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${activeTab === 'official' ? 'text-primary' : 'text-gray-400'}`}>
                    公众号
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* 二维码展示 */}
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="w-48 h-48 mx-auto mb-4 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={activeTab === 'wechat-work' ? '/qrcode-wechat-work.png' : '/qrcode-official.png'}
                alt={activeTab === 'wechat-work' ? '企业微信二维码' : '公众号二维码'}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-gray-600 text-sm">
              {activeTab === 'wechat-work' ? '请添加企业微信客服' : '请关注公众号'}
            </p>
            <p className="text-primary font-medium mt-2">
              {activeTab === 'wechat-work' ? '扫码添加企业微信好友' : '扫码关注公众号'}
            </p>
          </div>

          {/* 安全提示 */}
          <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
            <h3 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              安全提示
            </h3>
            <ul className="space-y-2 text-sm text-yellow-400/80">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>平台担保交易，安全有保障</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>官方流程操作，账号信息严格保密</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>请勿私下转账，谨防诈骗</span>
              </li>
            </ul>
          </div>

          {/* 协议同意 */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="rentAgreement"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <Label htmlFor="rentAgreement" className="text-sm text-gray-400 cursor-pointer leading-relaxed">
              我已阅读并同意
              <a href="#" className="text-primary hover:underline mx-1">《账号租赁服务协议》</a>
              和
              <a href="#" className="text-primary hover:underline mx-1">《隐私政策》</a>
            </Label>
          </div>

          {/* 确认按钮 */}
          <Button
            className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${
              agreed
                ? 'bg-primary text-black hover:bg-primary-dark'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!agreed}
            onClick={onClose}
          >
            <Check className="w-5 h-5 mr-2" />
            我已联系客服
          </Button>
          
          {!agreed && (
            <p className="text-center text-gray-500 text-sm">
              请先同意服务协议
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
