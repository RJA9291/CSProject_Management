// Fictional app screens. All brands, names, numbers and links are invented;
// personal data is masked and links are defanged (hxxp / [.] / .example).
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONTS} from '../theme';
import {clamp, ease, progress} from './motion';

const ui: React.CSSProperties = {fontFamily: FONTS.body, color: 'white'};

export const AppIcon: React.FC<{letter: string; bg: string; size?: number}> = ({letter, bg, size = 56}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.26,
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONTS.body,
      fontWeight: 800,
      fontSize: size * 0.48,
      color: 'white',
      flexShrink: 0,
    }}
  >
    {letter}
  </div>
);

const Check: React.FC<{size?: number; color?: string; p?: number}> = ({size = 40, color = 'white', p = 1}) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path
      d="M9 21 l7 7 l15 -16"
      fill="none"
      stroke={color}
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="40"
      strokeDashoffset={40 * (1 - p)}
    />
  </svg>
);

// ---------------------------------------------------------------- social feed

const POSTS = [
  {user: 'aina.travels', place: 'Penang', g: ['#ff7e5f', '#feb47b', '#2b5876'], likes: '2,431'},
  {user: 'kopi_kaw_kl', place: 'Bangsar, KL', g: ['#3a1c71', '#d76d77', '#ffaf7b'], likes: '918'},
  {user: 'hafiz.runs', place: 'Putrajaya', g: ['#134e5e', '#71b280', '#0f2027'], likes: '5,102'},
  {user: 'mamak.diaries', place: 'Petaling Jaya', g: ['#f7971e', '#ffd200', '#3c1053'], likes: '1,277'},
  {user: 'weiling.design', place: 'Johor Bahru', g: ['#4568dc', '#b06ab3', '#0b0b2b'], likes: '3,664'},
];

const PostImage: React.FC<{g: string[]; i: number}> = ({g, i}) => (
  <div style={{position: 'relative', height: 520, background: `linear-gradient(160deg, ${g[0]}, ${g[1]} 55%, ${g[2]})`, overflow: 'hidden'}}>
    {/* abstract skyline / landscape silhouettes */}
    <svg width="564" height="520" viewBox="0 0 564 520" style={{position: 'absolute', bottom: 0}}>
      {i % 2 === 0 ? (
        <path d="M0 400 L60 380 L60 300 L90 300 L90 360 L140 360 L140 250 L170 230 L200 250 L200 370 L260 370 L260 320 L300 320 L300 390 L360 390 L360 280 L380 200 L400 280 L400 380 L470 380 L470 330 L520 330 L520 400 L564 400 L564 520 L0 520Z" fill="rgba(0,0,0,0.55)" />
      ) : (
        <path d="M0 420 Q120 300 240 380 T564 340 L564 520 L0 520Z" fill="rgba(0,0,0,0.5)" />
      )}
      <circle cx={i % 2 ? 420 : 140} cy="150" r="56" fill="rgba(255,255,255,0.35)" />
    </svg>
  </div>
);

export const SocialFeed: React.FC<{scroll: number}> = ({scroll}) => (
  <div style={{...ui, position: 'absolute', inset: 0, background: '#000'}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: -scroll + 100}}>
      {[...POSTS, ...POSTS].map((p, i) => (
        <div key={i} style={{marginBottom: 26}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 22px'}}>
            <div style={{width: 46, height: 46, borderRadius: 23, background: `linear-gradient(135deg, ${p.g[0]}, ${p.g[2]})`, border: '2px solid #e1306c'}} />
            <div>
              <div style={{fontWeight: 600, fontSize: 22}}>{p.user}</div>
              <div style={{fontSize: 18, color: '#aaa'}}>{p.place}</div>
            </div>
          </div>
          <PostImage g={p.g} i={i} />
          <div style={{display: 'flex', gap: 22, padding: '14px 22px 4px'}}>
            <svg width="34" height="34" viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" fill={i % 3 === 0 ? '#ff3b5c' : 'none'} stroke={i % 3 === 0 ? '#ff3b5c' : 'white'} strokeWidth="2" /></svg>
            <svg width="34" height="34" viewBox="0 0 24 24"><path d="M4 5h16v11H8l-4 4z" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" /></svg>
            <svg width="34" height="34" viewBox="0 0 24 24"><path d="M3 11l18-8-8 18-2-8z" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round" /></svg>
          </div>
          <div style={{padding: '0 22px', fontSize: 20, fontWeight: 600}}>{p.likes} likes</div>
        </div>
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------- shopping

const PRODUCTS = [
  {name: 'Wireless Earbuds Pro', price: 'RM89.00', was: 'RM199', c: ['#1d2b64', '#f8cdda']},
  {name: 'Kasut Larian Ultra', price: 'RM159.00', was: 'RM289', c: ['#ff512f', '#dd2476']},
  {name: 'Baju Kurung Moden', price: 'RM79.90', was: 'RM129', c: ['#11998e', '#38ef7d']},
  {name: 'Power Bank 20000mAh', price: 'RM49.00', was: 'RM99', c: ['#232526', '#414345']},
];

export const ShopScreen: React.FC<{added: number; scroll?: number}> = ({added, scroll = 0}) => (
  <div style={{...ui, position: 'absolute', inset: 0, background: '#0d0f14'}}>
    <div style={{position: 'absolute', top: 92, left: 0, right: 0, padding: '0 24px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <AppIcon letter="K" bg="linear-gradient(135deg,#ff7a18,#ff3d3d)" size={50} />
        <div style={{fontWeight: 800, fontSize: 30}}>KedaiKu</div>
        <div style={{marginLeft: 'auto', fontSize: 18, background: '#ff3d3d', padding: '6px 12px', borderRadius: 10, fontWeight: 800}}>MEGA SALE</div>
      </div>
      <div style={{marginTop: 18, height: 54, borderRadius: 14, background: '#1c2029', display: 'flex', alignItems: 'center', padding: '0 18px', color: '#7d8698', fontSize: 20}}>
        Cari produk...
      </div>
    </div>
    <div style={{position: 'absolute', top: 290 - scroll, left: 24, right: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
      {PRODUCTS.map((p, i) => (
        <div key={i} style={{background: '#171a22', borderRadius: 20, overflow: 'hidden'}}>
          <div style={{height: 230, background: `linear-gradient(135deg, ${p.c[0]}, ${p.c[1]})`, position: 'relative'}}>
            <div style={{position: 'absolute', top: 12, left: 12, background: '#ff3d3d', fontSize: 16, fontWeight: 800, padding: '4px 10px', borderRadius: 8}}>
              -{45 + i * 5}%
            </div>
          </div>
          <div style={{padding: 14}}>
            <div style={{fontSize: 19, fontWeight: 600, lineHeight: 1.2}}>{p.name}</div>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8}}>
              <span style={{fontSize: 24, fontWeight: 800, color: '#ff7a18'}}>{p.price}</span>
              <span style={{fontSize: 16, color: '#666', textDecoration: 'line-through'}}>{p.was}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div
      style={{
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 60,
        height: 92,
        borderRadius: 24,
        background: added > 0.5 ? '#1fbf6a' : 'linear-gradient(90deg,#ff7a18,#ff3d3d)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        fontWeight: 800,
        fontSize: 30,
        transform: `scale(${1 - Math.sin(Math.min(added, 1) * Math.PI) * 0.06})`,
      }}
    >
      {added > 0.5 ? (
        <>
          <Check size={40} p={Math.min(1, (added - 0.5) * 3)} /> Ditambah ke Troli
        </>
      ) : (
        'Tambah ke Troli'
      )}
    </div>
  </div>
);

// ---------------------------------------------------------------- bank transfer

export const BankTransfer: React.FC<{p: number}> = ({p}) => {
  const done = p > 0.45;
  const ring = interpolate(p, [0.45, 0.8], [0, 1], {...clamp, easing: ease.out});
  return (
    <div style={{...ui, position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0b1e3f,#060b16)'}}>
      <div style={{position: 'absolute', top: 100, left: 28, right: 28, display: 'flex', alignItems: 'center', gap: 14}}>
        <AppIcon letter="B" bg="linear-gradient(135deg,#1e6bff,#00c2ff)" size={50} />
        <div style={{fontWeight: 800, fontSize: 28}}>BankKita</div>
        <div style={{marginLeft: 'auto', fontSize: 18, color: '#8fb3ff'}}>Pindahan Segera</div>
      </div>
      <div style={{position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center'}}>
        <div
          style={{
            width: 190,
            height: 190,
            margin: '0 auto',
            borderRadius: '50%',
            border: `8px solid ${done ? '#1fbf6a' : '#1e3a6b'}`,
            borderTopColor: done ? '#1fbf6a' : '#4fa3ff',
            transform: done ? `scale(${0.85 + ring * 0.15})` : `rotate(${p * 900}deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: done ? `rgba(31,191,106,${0.15 * ring})` : 'transparent',
          }}
        >
          {done && <Check size={110} color="#1fbf6a" p={ring} />}
        </div>
        <div style={{marginTop: 36, fontSize: 30, fontWeight: 800}}>{done ? 'Pindahan Berjaya' : 'Memproses...'}</div>
        <div style={{marginTop: 8, fontSize: 20, color: '#8a97ad'}}>Transfer Successful</div>
        <div style={{marginTop: 40, fontSize: 64, fontWeight: 800, letterSpacing: -1}}>RM 250.00</div>
      </div>
      <div style={{position: 'absolute', top: 760, left: 28, right: 28, background: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 26, fontSize: 21}}>
        {[
          ['Kepada', 'Aina S.'],
          ['Akaun', '•••• •••• 4821'],
          ['Rujukan', 'Duit makan'],
          ['Tarikh', '31 Okt, 11:47 PM'],
        ].map(([a, b]) => (
          <div key={a} style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)'}}>
            <span style={{color: '#8a97ad'}}>{a}</span>
            <span style={{fontWeight: 600}}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- chat

export type ChatMsg = {from: 'me' | 'them'; text: string; at: number; link?: string; danger?: boolean};

export const ChatScreen: React.FC<{
  title: string;
  subtitle: string;
  avatar?: string;
  messages: ChatMsg[];
  typingAt?: number;
  unknown?: boolean;
  linkHighlight?: number;
}> = ({title, subtitle, avatar = '#3a4558', messages, typingAt, unknown, linkHighlight = 0}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{...ui, position: 'absolute', inset: 0, background: '#0b141a'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage: 'radial-gradient(circle at 20px 20px, white 2px, transparent 3px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 190, background: '#1f2c34', display: 'flex', alignItems: 'flex-end', padding: '0 24px 22px', gap: 16}}>
        <svg width="26" height="40" viewBox="0 0 26 40"><path d="M20 6 L6 20 L20 34" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" /></svg>
        <div style={{width: 64, height: 64, borderRadius: 32, background: avatar, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width="40" height="40" viewBox="0 0 24 24"><circle cx="12" cy="9" r="4" fill="rgba(255,255,255,0.7)" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" fill="rgba(255,255,255,0.7)" /></svg>
        </div>
        <div>
          <div style={{fontWeight: 600, fontSize: 26}}>{title}</div>
          <div style={{fontSize: 19, color: unknown ? '#ff8a8a' : '#8696a0'}}>{subtitle}</div>
        </div>
      </div>
      <div style={{position: 'absolute', top: 220, left: 22, right: 22, display: 'flex', flexDirection: 'column', gap: 16}}>
        {messages.map((m, i) => {
          const p = progress(frame, m.at, 10);
          if (frame < m.at) return null;
          const me = m.from === 'me';
          return (
            <div
              key={i}
              style={{
                alignSelf: me ? 'flex-end' : 'flex-start',
                maxWidth: '84%',
                background: me ? '#005c4b' : '#202c33',
                borderRadius: 18,
                borderTopRightRadius: me ? 4 : 18,
                borderTopLeftRadius: me ? 18 : 4,
                padding: '14px 18px 10px',
                fontSize: 23,
                lineHeight: 1.35,
                opacity: p,
                transform: `translateY(${(1 - p) * 30}px) scale(${0.9 + p * 0.1})`,
                transformOrigin: me ? 'right bottom' : 'left bottom',
              }}
            >
              {m.text}
              {m.link && (
                <div
                  style={{
                    marginTop: 8,
                    color: '#53bdeb',
                    textDecoration: 'underline',
                    wordBreak: 'break-all',
                    background: linkHighlight > 0 ? `rgba(83,189,235,${0.25 * linkHighlight})` : 'transparent',
                    borderRadius: 6,
                  }}
                >
                  {m.link}
                </div>
              )}
              <div style={{fontSize: 16, color: 'rgba(255,255,255,0.5)', textAlign: 'right', marginTop: 4}}>11:4{7 + (i % 2)} PM</div>
            </div>
          );
        })}
        {typingAt !== undefined && frame >= typingAt && (
          <div style={{alignSelf: 'flex-end', background: '#005c4b', borderRadius: 18, padding: '18px 22px', display: 'flex', gap: 8}}>
            {[0, 1, 2].map((d) => (
              <div key={d} style={{width: 12, height: 12, borderRadius: 6, background: 'white', opacity: 0.4 + 0.6 * Math.abs(Math.sin((frame + d * 5) / 5))}} />
            ))}
          </div>
        )}
      </div>
      <div style={{position: 'absolute', bottom: 34, left: 18, right: 18, height: 76, borderRadius: 38, background: '#2a3942', display: 'flex', alignItems: 'center', padding: '0 28px', color: '#8696a0', fontSize: 22}}>
        Mesej
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- incoming call

export const IncomingCall: React.FC<{label: string; number: string; at: number}> = ({label, number, at}) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - at);
  return (
    <div style={{...ui, position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, #3a0d14, #07080d 70%)'}}>
      <div style={{position: 'absolute', top: 210, left: 0, right: 0, textAlign: 'center'}}>
        <div style={{fontSize: 22, color: '#ff8a8a', letterSpacing: 2}}>PANGGILAN MASUK</div>
        <div style={{position: 'relative', width: 200, height: 200, margin: '60px auto 0'}}>
          {[0, 1, 2].map((r) => {
            const ph = ((t + r * 10) % 30) / 30;
            return (
              <div
                key={r}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: `3px solid ${COLORS.red}`,
                  transform: `scale(${1 + ph * 1.2})`,
                  opacity: 1 - ph,
                }}
              />
            );
          })}
          <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: '#2a1218', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 110, fontWeight: 800, color: '#ff5a66'}}>
            ?
          </div>
        </div>
        <div style={{marginTop: 70, fontSize: 40, fontWeight: 800}}>{label}</div>
        <div style={{marginTop: 12, fontSize: 28, color: '#c9ced8', fontFamily: FONTS.mono}}>{number}</div>
        <div style={{marginTop: 8, fontSize: 20, color: '#8a97ad'}}>Malaysia</div>
      </div>
      <div style={{position: 'absolute', bottom: 120, left: 70, right: 70, display: 'flex', justifyContent: 'space-between'}}>
        {[
          ['#e5383b', 'Tolak', 135],
          ['#1fbf6a', 'Jawab', 0],
        ].map(([c, l, rot]) => (
          <div key={l as string} style={{textAlign: 'center'}}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                background: c as string,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: l === 'Jawab' ? `translateY(${Math.sin(t / 3) * 6}px)` : undefined,
              }}
            >
              <svg width="60" height="60" viewBox="0 0 24 24" style={{transform: `rotate(${rot}deg)`}}>
                <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" fill="white" />
              </svg>
            </div>
            <div style={{marginTop: 14, fontSize: 22}}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- notification banner

export const Banner: React.FC<{
  app: string;
  letter: string;
  color: string;
  title?: string;
  text: string;
  p: number; // 0..1 slide in
  top?: number;
  danger?: boolean;
}> = ({app, letter, color, title, text, p, top = 70, danger}) => (
  <div
    style={{
      ...ui,
      position: 'absolute',
      left: 16,
      right: 16,
      top,
      transform: `translateY(${(1 - p) * -220}px) scale(${0.94 + 0.06 * p})`,
      opacity: Math.min(1, p * 1.5),
      background: 'rgba(38,42,52,0.92)',
      borderRadius: 30,
      padding: '18px 20px',
      display: 'flex',
      gap: 16,
      boxShadow: danger ? `0 0 0 2px rgba(255,45,61,0.55), 0 20px 60px rgba(0,0,0,0.6)` : '0 20px 60px rgba(0,0,0,0.6)',
      zIndex: 10,
    }}
  >
    <AppIcon letter={letter} bg={color} size={60} />
    <div style={{flex: 1, minWidth: 0}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 19, color: '#b9c0cc'}}>
        <span style={{fontWeight: 600}}>{app}</span>
        <span>sekarang</span>
      </div>
      {title && <div style={{fontSize: 21, fontWeight: 800, marginTop: 4}}>{title}</div>}
      <div style={{fontSize: 20, marginTop: 4, lineHeight: 1.3, color: '#e8ebf0'}}>{text}</div>
    </div>
  </div>
);

// ---------------------------------------------------------------- phishing page

export const PhishPage: React.FC<{url: string; bank: string; message: string; button: string; press: number; hover: number}> = ({
  url,
  bank,
  message,
  button,
  press,
  hover,
}) => (
  <div style={{...ui, position: 'absolute', inset: 0, background: '#0e1526', color: '#e8edf6'}}>
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 180, background: '#1a2235', display: 'flex', alignItems: 'flex-end', padding: '0 20px 20px'}}>
      <div style={{flex: 1, height: 58, borderRadius: 16, background: '#0b1020', display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px', fontSize: 19, color: '#b9c3d6', overflow: 'hidden', whiteSpace: 'nowrap'}}>
        <svg width="18" height="22" viewBox="0 0 18 22"><rect x="2" y="9" width="14" height="11" rx="2" fill="#999" /><path d="M5 9V6a4 4 0 0 1 8 0v3" stroke="#999" strokeWidth="2" fill="none" /></svg>
        {url}
      </div>
    </div>
    <div style={{position: 'absolute', top: 220, left: 36, right: 36}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <AppIcon letter="B" bg="linear-gradient(135deg,#1e6bff,#00c2ff)" size={60} />
        <div style={{fontWeight: 800, fontSize: 34}}>{bank}</div>
      </div>
      <div style={{marginTop: 34, padding: 22, background: 'rgba(255,45,61,0.12)', border: '2px solid rgba(255,90,102,0.6)', borderRadius: 18, fontSize: 22, lineHeight: 1.35, color: '#ff9aa2', fontWeight: 600}}>
        {message}
      </div>
      {['No. Kad Pengenalan', 'Nama Pengguna', 'Kata Laluan'].map((f) => (
        <div key={f} style={{marginTop: 26}}>
          <div style={{fontSize: 19, color: '#8a97ad', marginBottom: 8}}>{f}</div>
          <div style={{height: 64, borderRadius: 14, background: '#141d31', border: '2px solid #26324a'}} />
        </div>
      ))}
      <div
        style={{
          marginTop: 44,
          height: 92,
          borderRadius: 18,
          background: `rgb(${30 + hover * 200}, ${107 - hover * 60}, ${255 - hover * 190})`,
          color: 'white',
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${1 - press * 0.05})`,
          boxShadow: `0 0 ${hover * 50}px rgba(255,45,61,${hover * 0.8})`,
        }}
      >
        {button}
      </div>
    </div>
  </div>
);
