import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface XtermTerminalProps {
  onData: (data: string) => void; // 发送数据到后端
  onReady?: (term: XTerm) => void; // 终端初始化完成回调
  resetSignal?: boolean; // 断开重连时重置终端
  sessionId?: string; // 当前 session ID
  initialContent?: string; // 初始内容
}

const XtermTerminal = forwardRef<any, XtermTerminalProps>(({ onData, onReady, resetSignal, sessionId, initialContent }, ref) => {
  const xtermRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const lastResetSignal = useRef<boolean | undefined>(undefined);
  const lastSessionId = useRef<string | undefined>(undefined);

  useImperativeHandle(ref, () => ({
    write: (data: string) => {
      if (termRef.current && data) {
        termRef.current.write(data);
      }
    },
    clear: () => {
      if (termRef.current) {
        termRef.current.clear();
      }
    },
    reset: () => {
      if (termRef.current) {
        termRef.current.reset();
      }
    }
  }), []);

  useEffect(() => {
    if (!xtermRef.current) return;
    
    // 初始化 xterm
    const term = new XTerm({
      fontSize: 14,
      fontFamily: 'monospace',
      theme: {
        background: '#000000',
        foreground: '#00FF00',
      },
      cursorBlink: true,
      scrollback: 1000,
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(xtermRef.current);
    fitAddon.fit();
    termRef.current = term;
    fitAddonRef.current = fitAddon;

    // 输入事件
    term.onData((data) => {
      onData(data);
    });

    // 通知父组件
    if (onReady) onReady(term);

    // 自适应窗口
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, []);

  // 处理 session 切换
  useEffect(() => {
    if (sessionId && sessionId !== lastSessionId.current) {
      lastSessionId.current = sessionId;
      
      // 清空终端内容
      if (termRef.current) {
        termRef.current.clear();
      }
      
      // 如果有初始内容，写入到终端
      if (initialContent && termRef.current) {
        termRef.current.write(initialContent);
      }
    }
  }, [sessionId, initialContent]);

  // 断开重连时重置终端
  useEffect(() => {
    if (resetSignal && lastResetSignal.current !== resetSignal) {
      termRef.current?.reset();
      lastResetSignal.current = resetSignal;
    }
  }, [resetSignal]);

  return (
    <div ref={xtermRef} style={{ width: '100%', height: '100%' }} />
  );
});

export default XtermTerminal;