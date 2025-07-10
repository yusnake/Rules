// 参考 Verge Rev 示例 Script 配置
//
// Clash Verge Rev (Version ≥ 17.2) & Mihomo-Party (Version ≥ 1.5.10)
//
// 最后更新时间: 2025-06-12 13:30

// 规则集通用配置
const ruleProviderCommon = {
};

// 策略组通用配置
const groupBaseOption = {
  "interval": 300,
  "url": "https://www.gstatic.com/generate_204",
  "max-failed-times": 3,
};

// 程序入口
function main(config) {
  const proxyCount = config?.proxies?.length ?? 0;
  const proxyProviderCount =
    typeof config?.["proxy-providers"] === "object" ? Object.keys(config["proxy-providers"]).length : 0;
  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理");
  }

  // 覆盖通用配置
  config["mixed-port"] = "7890";
  config["tcp-concurrent"] = true;
  config["allow-lan"] = true;
  config["ipv6"] = true;
  config["log-level"] = "info";
  config["unified-delay"] = "true";
  config["find-process-mode"] = "strict";
  config["global-client-fingerprint"] = "chrome";

  // 覆盖 dns 配置
  config["dns"] = {
    "enable": true,
    "listen": "0.0.0.0:1053",
    "ipv6": false,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-filter": ["*", "+.lan", "+.local", "+.direct", "+.msftconnecttest.com", "+.msftncsi.com"],
    "default-nameserver": ["223.5.5.5", "119.29.29.29"],
    "nameserver": ["https://dns.alidns.com/dns-query", "https://doh.pub/dns-query"],
    "proxy-server-nameserver": ["https://dns.alidns.com/dns-query", "https://doh.pub/dns-query"]
  };

  // 覆盖 geodata 配置
  config["geodata-mode"] = true;
  config["geox-url"] = {
    "geoip": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.dat",
    "geosite": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat",
    "mmdb": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/country.mmdb",
    "asn": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/GeoLite2-ASN.mmdb"
  };

  // 覆盖 sniffer 配置
  config["sniffer"] = {
    "enable": true,
    "parse-pure-ip": true,
    "sniff": {
      "TLS": {
        "ports": ["443", "8443"]
      },
      "HTTP": {
        "ports": ["80", "8080-8880"],
        "override-destination": true
      },
      "QUIC": {
        "ports": ["443", "8443"]
      }
    }
  };

  // 覆盖 tun 配置
  config["tun"] = {
    "enable": true,
    "stack": "mixed",
    "dns-hijack": ["any:53"],
    "auto-route": true,
    "auto-detect-interface": true
  };

  overwriteProxyGroups(config);

  // 覆盖策略组
 /*  config["proxy-groups"] = [
    {
      ...groupBaseOption,
      "name": "Final",
      "type": "select",
      "proxies": ["Proxy", "DIRECT"],
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Final.png"
    },
    {
      ...groupBaseOption,
      "name": "Proxy",
      "type": "select",
      "proxies": ["中国", "香港", "台湾", "日本", "韩国", "加拿大", "泰国", "法国", "俄罗斯", "新加坡", "美国", "德国", "越南", "其他", "DIRECT"],
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Rocket.png"
    },
    {
      ...groupBaseOption,
      "name": "YouTube",
      "type": "select",
      "proxies": ["中国", "香港", "台湾", "日本", "韩国", "加拿大", "泰国", "法国", "俄罗斯", "新加坡", "美国", "德国", "越南", "其他"],
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/YouTube.png"
    },
    {
      ...groupBaseOption,
      "name": "TikTok",
      "type": "select",
      "proxies": ["中国", "香港", "台湾", "日本", "韩国", "加拿大", "泰国", "法国", "俄罗斯", "新加坡", "美国", "德国", "越南", "其他"],
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/TikTok.png"
    },
    {
      ...groupBaseOption,
      "name": "bilibili",
      "type": "select",
      "proxies": ["DIRECT", "中国", "香港", "台湾"],
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/bilibili_3.png"
    },
    {
      ...groupBaseOption,
      "name": "Telegram",
      "type": "select",
      "proxies": ["中国", "香港", "台湾", "日本", "韩国", "加拿大", "泰国", "法国", "俄罗斯", "新加坡", "美国", "德国", "越南", "其他"],
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Telegram_X.png"
    },
    {
      ...groupBaseOption,
      "name": "X",
      "type": "select",
      "proxies": ["中国", "香港", "台湾", "日本", "韩国", "加拿大", "泰国", "法国", "俄罗斯", "新加坡", "美国", "德国", "越南", "其他"],
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/X.png"
    },
    // 地区分组
    {
      ...groupBaseOption,
      "name": "中国",
      "type": "select",
      "proxies": ["CN-Auto", "CN-FallBack", "CN-LoadBalance"],
      "include-all": true,
      "filter": "(?i)🇨🇳|中国|(\b(CN|China)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/China.png"
    },
    {
      ...groupBaseOption,
      "name": "CN-Auto",
      "type": "url-test",
      "tolerance": 50,
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇨🇳|中国|(\b(CN|China)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/China.png"
    },
    {
      ...groupBaseOption,
      "name": "CN-FallBack",
      "type": "fallback",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇨🇳|中国|(\b(CN|China)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/China.png"
    },
    {
      ...groupBaseOption,
      "name": "CN-LoadBalance",
      "type": "load-balance",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇨🇳||中国|(\b(CN|China)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/China.png"
    },
    {
      ...groupBaseOption,
      "name": "香港",
      "type": "select",
      "proxies": ["HK-Auto", "HK-FallBack", "HK-LoadBalance"],
      "include-all": true,
      "filter": "(?i)🇭🇰|香港|(\b(HK|Hong)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hong_Kong.png"
    },
    {
      ...groupBaseOption,
      "name": "HK-Auto",
      "type": "url-test",
      "tolerance": 50,
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇭🇰|香港|(\b(HK|Hong)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hong_Kong.png"
    },
    {
      ...groupBaseOption,
      "name": "HK-FallBack",
      "type": "fallback",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇭🇰|香港|(\b(HK|Hong)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hong_Kong.png"
    },
    {
      ...groupBaseOption,
      "name": "HK-LoadBalance",
      "type": "load-balance",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇭🇰|香港|(\b(HK|Hong)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hong_Kong.png"
    },
    {
      ...groupBaseOption,
      "name": "台湾",
      "type": "select",
      "proxies": ["TW-Auto", "TW-FallBack", "TW-LoadBalance"],
      "include-all": true,
      "filter": "(?i)🇨🇳|🇹🇼|台湾|(\b(TW|Tai|Taiwan)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Taiwan.png"
    },
    {
      ...groupBaseOption,
      "name": "TW-Auto",
      "type": "url-test",
      "tolerance": 50,
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇨🇳|🇹🇼|台湾|(\b(TW|Tai|Taiwan)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Taiwan.png"
    },
    {
      ...groupBaseOption,
      "name": "TW-FallBack",
      "type": "fallback",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇨🇳|🇹🇼|台湾|(\b(TW|Tai|Taiwan)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Taiwan.png"
    },
    {
      ...groupBaseOption,
      "name": "TW-LoadBalance",
      "type": "load-balance",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇨🇳|🇹🇼|台湾|(\b(TW|Tai|Taiwan)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Taiwan.png"
    },
    {
      ...groupBaseOption,
      "name": "日本",
      "type": "select",
      "proxies": ["JP-Auto", "JP-FallBack", "JP-LoadBalance"],
      "include-all": true,
      "filter": "(?i)🇯🇵|日本|东京|(\b(JP|Japan)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png"
    },
    {
      ...groupBaseOption,
      "name": "JP-Auto",
      "type": "url-test",
      "tolerance": 50,
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇯🇵|日本|东京|(\b(JP|Japan)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png"
    },
    {
      ...groupBaseOption,
      "name": "JP-FallBack",
      "type": "fallback",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇯🇵|日本|东京|(\b(JP|Japan)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png"
    },
    {
      ...groupBaseOption,
      "name": "JP-LoadBalance",
      "type": "load-balance",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇯🇵|日本|东京|(\b(JP|Japan)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png"
    },
    {
      ...groupBaseOption,
      "name": "韩国",
      "type": "select",
      "proxies": ["KR-Auto", "KR-FallBack", "KR-LoadBalance"],
      "include-all": true,
      "filter": "(?i)🇰🇷|韩国|(\b(KR|Korea)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Korea.png"
    },
    {
      ...groupBaseOption,
      "name": "KR-Auto",
      "type": "url-test",
      "tolerance": 30,
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇰🇷|韩国|(\b(KR|Korea)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Korea.png"
    },
    {
      ...groupBaseOption,
      "name": "KR-FallBack",
      "type": "fallback",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇰🇷|韩国|(\b(KR|Korea)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Korea.png"
    },
    {
      ...groupBaseOption,
      "name": "KR-LoadBalance",
      "type": "load-balance",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇰🇷|韩国|(\b(KR|Korea)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Korea.png"
    },
    {
      ...groupBaseOption,
      "name": "加拿大",
      "type": "select",
      "proxies": ["CAN-Auto", "CAN-FallBack", "CAN-LoadBalance"],
      "include-all": true,
      "filter": "(?i)🇨🇦|加拿大|(\b(CAN|Canada)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Canada.png"
    },
    {
      ...groupBaseOption,
      "name": "CAN-Auto",
      "type": "url-test",
      "tolerance": 30,
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇨🇦|加拿大|(\b(CAN|Canada)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Canada.png"
    },
    {
      ...groupBaseOption,
      "name": "CAN-FallBack",
      "type": "fallback",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇨🇦|加拿大|(\b(CAN|Canada)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Canada.png"
    },
    {
      ...groupBaseOption,
      "name": "CAN-LoadBalance",
      "type": "load-balance",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇨🇦|加拿大|(\b(CAN|Canada)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Canada.png"
    },
    {
      ...groupBaseOption,
      "name": "泰国",
      "type": "select",
      "proxies": ["TH-Auto", "TH-FallBack", "TH-LoadBalance"],
      "include-all": true,
      "filter": "(?i)🇹🇭|泰国|(\b(TH|Thailand)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Thailand.png"
    },
    {
      ...groupBaseOption,
      "name": "TH-Auto",
      "type": "url-test",
      "tolerance": 50,
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇹🇭|太国|(\b(TH|Thailand)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Thailand.png"
    },
    {
      ...groupBaseOption,
      "name": "TH-FallBack",
      "type": "fallback",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇹🇭|泰国|(\b(TH|Thailand)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Thailand.png"
    },
    {
      ...groupBaseOption,
      "name": "TH-LoadBalance",
      "type": "load-balance",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇹🇭|泰国|(\b(TH|Thailand)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Thailand.png"
    },
    {
      ...groupBaseOption,
      "name": "法国",
      "type": "select",
      "proxies": ["FRA-Auto", "FRA-FallBack", "FRA-LoadBalance"],
      "include-all": true,
      "filter": "(?i)🇫🇷|法国|(\b(FRA|France)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/France.png"
    },
    {
      ...groupBaseOption,
      "name": "FRA-Auto",
      "type": "url-test",
      "tolerance": 50,
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇫🇷|法国|(\b(FRA|France)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/France.png"
    },
    {
      ...groupBaseOption,
      "name": "FRA-FallBack",
      "type": "fallback",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇫🇷|法国|(\b(FRA|France)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/France.png"
    },
    {
      ...groupBaseOption,
      "name": "FRA-LoadBalance",
      "type": "load-balance",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇫🇷|法国|(\b(FRA|France)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/France.png"
    },
    {
      ...groupBaseOption,
      "name": "俄罗斯",
      "type": "select",
      "proxies": ["RU-Auto", "RU-FallBack", "RU-LoadBalance"],
      "include-all": true,
      "filter": "(?i)🇷🇺|俄罗斯|(\b(RU|Russia)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Russia.png"
    },
    {
      ...groupBaseOption,
      "name": "RU-Auto",
      "type": "url-test",
      "tolerance": 50,
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇷🇺|俄罗斯|(\b(RU|Russia)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Russia.png"
    },
    {
      ...groupBaseOption,
      "name": "RU-FallBack",
      "type": "fallback",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇷🇺|俄罗斯|(\b(RU|Russia)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Russia.png"
    },
    {
      ...groupBaseOption,
      "name": "RU-LoadBalance",
      "type": "load-balance",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇷🇺|俄罗斯|(\b(RU|Russia)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Russia.png"
    },
    {
      ...groupBaseOption,
      "name": "新加坡",
      "type": "select",
      "proxies": ["SG-Auto", "SG-FallBack", "SG-LoadBalance"],
      "include-all": true,
      "filter": "(?i)🇸🇬|新加坡|狮|(\b(SG|Singapore)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Singapore.png"
    },
    {
      ...groupBaseOption,
      "name": "SG-Auto",
      "type": "url-test",
      "tolerance": 50,
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇸🇬|新加坡|狮|(\b(SG|Singapore)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Singapore.png"
    },
    {
      ...groupBaseOption,
      "name": "SG-FallBack",
      "type": "fallback",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇸🇬|新加坡|狮|(\b(SG|Singapore)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Singapore.png"
    },
    {
      ...groupBaseOption,
      "name": "SG-LoadBalance",
      "type": "load-balance",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇸🇬|新加坡|狮|(\b(SG|Singapore)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Singapore.png"
    },
    {
      ...groupBaseOption,
      "name": "美国",
      "type": "select",
      "proxies": ["US-Auto", "US-FallBack", "US-LoadBalance"],
      "include-all": true,
      "filter": "(?i)🇺🇸|美国|洛杉矶|圣何塞|(\b(US|United States)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png"
    },
    {
      ...groupBaseOption,
      "name": "US-Auto",
      "type": "url-test",
      "tolerance": 50,
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇺🇸|美国|洛杉矶|圣何塞|(\b(US|United States)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png"
    },
    {
      ...groupBaseOption,
      "name": "US-FallBack",
      "type": "fallback",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇺🇸|美国|洛杉矶|圣何塞|(\b(US|United States)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png"
    },
    {
      ...groupBaseOption,
      "name": "US-LoadBalance",
      "type": "load-balance",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇺🇸|美国|洛杉矶|圣何塞|(\b(US|United States)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png"
    },
    {
      ...groupBaseOption,
      "name": "德国",
      "type": "select",
      "proxies": ["DE-Auto", "DE-FallBack", "DE-LoadBalance"],
      "include-all": true,
      "filter": "(?i)🇩🇪|德国|(\b(DE|Germany)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Germany.png"
    },
    {
      ...groupBaseOption,
      "name": "DE-Auto",
      "type": "url-test",
      "tolerance": 50,
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇩🇪|德国|(\b(DE|Germany)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Germany.png"
    },
    {
      ...groupBaseOption,
      "name": "DE-FallBack",
      "type": "fallback",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇩🇪|德国|(\b(DE|Germany)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Germany.png"
    },
    {
      ...groupBaseOption,
      "name": "DE-LoadBalance",
      "type": "load-balance",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇩🇪|德国|(\b(DE|Germany)\b)",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Germany.png"
    },
    {
      ...groupBaseOption,
      "name": "越南",
      "type": "select",
      "proxies": ["VN-Auto", "VN-FallBack", "VN-LoadBalance"],
      "include-all": true,
      "filter": "(?i)🇻🇳|越南|(\b(VN|Vietnam)\b)",
      "icon": "https://img1.baidu.com/it/u=3283399533,2551674434&fm=253&fmt=auto&app=138&f=GIF?w=749&h=500"
    },
    {
      ...groupBaseOption,
      "name": "VN-Auto",
      "type": "url-test",
      "tolerance": 50,
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇻🇳|越南|(\b(VN|Vietnam)\b)",
      "icon": "https://img1.baidu.com/it/u=3283399533,2551674434&fm=253&fmt=auto&app=138&f=GIF?w=749&h=500"
    },
    {
      ...groupBaseOption,
      "name": "VN-FallBack",
      "type": "fallback",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇻🇳|越南|(\b(VN|Vietnam)\b)",
      "icon": "https://img1.baidu.com/it/u=3283399533,2551674434&fm=253&fmt=auto&app=138&f=GIF?w=749&h=500"
    },
    {
      ...groupBaseOption,
      "name": "VN-LoadBalance",
      "type": "load-balance",
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?i)🇻🇳|越南|(\b(VN|Vietnam)\b)",
      "icon": "https://img1.baidu.com/it/u=3283399533,2551674434&fm=253&fmt=auto&app=138&f=GIF?w=749&h=500"
    },
    {
      ...groupBaseOption,
      "name": "其他",
      "type": "select",
      "proxies": ["All-Auto"],
      "include-all": true,
      "filter": "(?=.*(.))(?!.*((?i)群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|(\b(USE|USED|TOTAL|Traffic|Expire|EMAIL|Panel|Channel|Author)\b|(\d{4}-\d{2}-\d{2}|\d+G)))).*$",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Airport.png"
    },
    {
      ...groupBaseOption,
      "name": "All-Auto",
      "type": "url-test",
      "tolerance": 50,
      "lazy": true,
      "include-all": true,
      "hidden": true,
      "filter": "(?=.*(.))(?!.*((?i)群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|(\b(USE|USED|TOTAL|Traffic|Expire|EMAIL|Panel|Channel|Author)\b|(\d{4}-\d{2}-\d{2}|\d+G)))).*$",
      "icon": "https://gh-proxy.com/https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Airport.png"
    }
  ];  */
  
  // 覆盖策略组
  const customRules = [
    //"DOMAIN-SUFFIX,linux.do,代理模式",
    "DOMAIN-SUFFIX,cursor.com,Proxy",
    "DOMAIN-SUFFIX,cursor.sh,Proxy",
    "DOMAIN-SUFFIX,cursor-cdn.com,Proxy",
    "DOMAIN-SUFFIX,cursorapi.com,Proxy",
    "DOMAIN-SUFFIX,augmentcode.com,Proxy",
    "IP-CIDR,183.230.113.152/32,REJECT",
    "IP-CIDR,1.12.12.12/32,Proxy"
  ];

  
  const rules = [
		...customRules,
		//"RULE-SET,steam,Steam",
		"RULE-SET,telegramcidr,Telegram,no-resolve",
		"RULE-SET,openai,ChatGPT",
		"RULE-SET,claude,Claude",
		"RULE-SET,twitter,X.com",
		//"RULE-SET,spotify,Spotify",
		"RULE-SET,youtube,YouTube",
		"RULE-SET,google,Google",
		"RULE-SET,googleFCM,Google",
		"RULE-SET,onedrive,OneDrive",
		"RULE-SET,microsoft,Microsoft",
		"GEOIP,CN,DIRECT,no-resolve",
		"GEOIP,LAN,DIRECT,no-resolve",
		"GEOSITE,geolocation-cn,DIRECT",
		"RULE-SET,direct,DIRECT",
		"RULE-SET,cncidr,DIRECT",
		"RULE-SET,private,DIRECT",
		"RULE-SET,lancidr,DIRECT",
		"RULE-SET,applications,DIRECT",
		"RULE-SET,apple,Apple",
		"RULE-SET,icloud,Apple",
		"RULE-SET,reject,广告拦截",
		"RULE-SET,AD,广告拦截",
		"RULE-SET,EasyList,广告拦截",
		"RULE-SET,EasyListChina,广告拦截",
		"RULE-SET,EasyPrivacy,广告拦截",
		"RULE-SET,ProgramAD,广告拦截",
		// "RULE-SET,greatfire," + proxyName,
		// "RULE-SET,gfw," + proxyName,
		// "RULE-SET,proxy," + proxyName,
		// "RULE-SET,tld-not-cn," + proxyName,
		"MATCH,漏网之鱼",
	];

	const ruleProviders = {
		steam: {
			type: "http",
			behavior: "classical",
			url: "https://raw.githubusercontent.com/yangtb2024/Steam-Clash/refs/heads/main/Steam.txt",
			path: "./ruleset/steam.yaml",
			interval: 86400,
		},
		microsoft: {
			type: "http",
			behavior: "classical",
			url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Microsoft/Microsoft.yaml",
			path: "./ruleset/Microsoft.yaml",
			interval: 86400,
		},
		onedrive:{
			url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OneDrive/OneDrive.yaml",
			path: "./ruleset/OneDrive.yaml",
			behavior: "classical",
			interval: 86400,
			type: "http"
		},
		reject: {
			type: "http",
			behavior: "domain",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt",
			path: "./ruleset/reject.yaml",
			interval: 86400,
		},
		icloud: {
			type: "http",
			behavior: "classical",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt",
			path: "./ruleset/icloud.yaml",
			interval: 86400,
		},
		apple: {
			type: "http",
			behavior: "classical",
			url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Apple/Apple_Classical.yaml",
			path: "./ruleset/apple.yaml",
			interval: 86400,
		},
		google: {
			type: "http",
			behavior: "classical",
			url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Google/Google.yaml",
			path: "./ruleset/google.yaml",
			interval: 86400,
		},
		googleFCM: {
			type: "http",
			behavior: "classical",
			url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GoogleFCM/GoogleFCM.yaml",
			path: "./ruleset/GoogleFCM.yaml",
			interval: 86400,
		},
		youtube: {
			url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/YouTube/YouTube.yaml",
			path: "./ruleset/YouTube.yaml",
			behavior: "classical",
			interval: 86400,
			type: "http"
		},
		proxy: {
			type: "http",
			behavior: "domain",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt",
			path: "./ruleset/proxy.yaml",
			interval: 86400,
		},
		openai: {
			type: "http",
			behavior: "classical",
			url: "https://fastly.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/OpenAI/OpenAI.yaml",
			path: "./ruleset/custom/openai.yaml",
			interval: 86400,
		},
		claude: {
			type: "http",
			behavior: "classical",
			url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Claude/Claude.yaml",
			path: "./ruleset/custom/Claude.yaml",
			interval: 86400,
		},
		spotify: {
			type: "http",
			behavior: "classical",
			url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Spotify/Spotify.yaml",
			path: "./ruleset/custom/Spotify.yaml",
			interval: 86400,
		},
		telegramcidr: {
			type: "http",
			behavior: "ipcidr",
			url: "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt",
			path: "./ruleset/custom/telegramcidr.yaml",
			interval: 86400,
		},
		twitter: {
			type: "http",
			behavior: "classical",
			url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Twitter/Twitter.yaml",
			path: "./ruleset/custom/Twitter.yaml",
			interval: 86400,
		},
		direct: {
			type: "http",
			behavior: "domain",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
			path: "./ruleset/direct.yaml",
			interval: 86400,
		},
		private: {
			type: "http",
			behavior: "domain",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt",
			path: "./ruleset/private.yaml",
			interval: 86400,
		},
		gfw: {
			type: "http",
			behavior: "domain",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
			path: "./ruleset/gfw.yaml",
			interval: 86400,
		},
		greatfire: {
			type: "http",
			behavior: "domain",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/greatfire.txt",
			path: "./ruleset/greatfire.yaml",
			interval: 86400,
		},
		"tld-not-cn": {
			type: "http",
			behavior: "domain",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt",
			path: "./ruleset/tld-not-cn.yaml",
			interval: 86400,
		},
		cncidr: {
			type: "http",
			behavior: "ipcidr",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt",
			path: "./ruleset/cncidr.yaml",
			interval: 86400,
		},
		lancidr: {
			type: "http",
			behavior: "ipcidr",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt",
			path: "./ruleset/lancidr.yaml",
			interval: 86400,
		},
		applications: {
			type: "http",
			behavior: "classical",
			url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt",
			path: "./ruleset/applications.yaml",
			interval: 86400,
		},
		AD: {
		  type: "http",
		  behavior: "domain",
		  url: "https://raw.githubusercontent.com/earoftoast/clash-rules/main/AD.yaml",
		  path: "./rules/AD.yaml",
		  interval: 86400,
		},
		EasyList: {
		  type: "http",
		  behavior: "domain",
		  url: "https://raw.githubusercontent.com/earoftoast/clash-rules/main/EasyList.yaml",
		  path: "./rules/EasyList.yaml",
		  interval: 86400,
		},
		EasyListChina: {
		  type: "http",
		  behavior: "domain",
		  url: "https://raw.githubusercontent.com/earoftoast/clash-rules/main/EasyListChina.yaml",
		  path: "./rules/EasyListChina.yaml",
		  interval: 86400,
		},
		EasyPrivacy: {
		  type: "http",
		  behavior: "domain",
		  url: "https://raw.githubusercontent.com/earoftoast/clash-rules/main/EasyPrivacy.yaml",
		  path: "./rules/EasyPrivacy.yaml",
		  interval: 86400,
		},
		ProgramAD: {
		  type: "http",
		  behavior: "domain",
		  url: "https://raw.githubusercontent.com/earoftoast/clash-rules/main/ProgramAD.yaml",
		  path: "./rules/ProgramAD.yaml",
		  interval: 86400,
		}
	};

	config["rule-providers"] = ruleProviders;
	config["rules"] = rules;




  

	

  
  // 覆盖规则集
/*   config["rule-providers"] = {
    "private-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.mrs",
      "path": "./rules/private-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "private-ip": {
      ...ruleProviderCommon,
      "behavior": "ipcidr",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/private.mrs",
      "path": "./rules/private-ip.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "ai-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ai-!cn.mrs",
      "path": "./rules/ai-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "youtube-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/youtube.mrs",
      "path": "./rules/youtube-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "netflix-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/netflix.mrs",
      "path": "./rules/netflix-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "netflix-ip": {
      ...ruleProviderCommon,
      "behavior": "ipcidr",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/netflix.mrs",
      "path": "./rules/netflix-ip.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "disney-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/disney.mrs",
      "path": "./rules/disney-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "emby-classical": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/Coldvvater/Mononoke/master/Clash/Rules/Emby.list",
      "path": "./rules/emby-classical.list",
      "type": "http",
      "format": "text",
      "interval": 86400
    },
    "tiktok-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/tiktok.mrs",
      "path": "./rules/tiktok-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "bahamut-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/bahamut.mrs",
      "path": "./rules/bahamut-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "biliintl-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/biliintl.mrs",
      "path": "./rules/biliintl-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "bilibili-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/bilibili.mrs",
      "path": "./bilibili-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "bilibili-ip": {
      ...ruleProviderCommon,
      "behavior": "ipcidr",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo-lite/geoip/bilibili.mrs",
      "path": "./bilibili-ip.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "spotify-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/spotify.mrs",
      "path": "./rules/spotify-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "proxymedia-classical": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/Coldvvater/Mononoke/master/Clash/Rules/ProxyMedia.list",
      "path": "./rules/proxymedia-classical.list",
      "type": "http",
      "format": "text",
      "interval": 86400
    },
    "wechat-classical": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/Coldvvater/Mononoke/master/Clash/Rules/WeChat.list",
      "path": "./rules/wechat-classical.list",
      "type": "http",
      "format": "text",
      "interval": 86400
    },
    "telegram-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.mrs",
      "path": "./rules/telegram-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "telegram-ip": {
      ...ruleProviderCommon,
      "behavior": "ipcidr",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.mrs",
      "path": "./rules/telegram-ip.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "github-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/github.mrs",
      "path": "./rules/github-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "twitter-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/twitter.mrs",
      "path": "./rules/twitter-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "twitter-ip": {
      ...ruleProviderCommon,
      "behavior": "ipcidr",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/twitter.mrs",
      "path": "./rules/twitter-ip.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "apple-classical": {
      ...ruleProviderCommon,
      "behavior": "classical",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/Coldvvater/Mononoke/master/Clash/Rules/AppleProxyService.list",
      "path": "./rules/apple-classical.list",
      "type": "http",
      "format": "text",
      "interval": 86400
    },
    "apple-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/apple.mrs",
      "path": "./rules/apple-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "apple-ip": {
      ...ruleProviderCommon,
      "behavior": "ipcidr",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo-lite/geoip/apple.mrs",
      "path": "./rules/apple-ip.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "google-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google.mrs",
      "path": "./rules/google-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "google-ip": {
      ...ruleProviderCommon,
      "behavior": "ipcidr",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/google.mrs",
      "path": "./rules/google-ip.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "microsoft-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft.mrs",
      "path": "./rules/microsoft-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "games-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-games.mrs",
      "path": "./rules/games-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "cn-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs",
      "path": "./rules/cn-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    },
    "proxy-domain": {
      ...ruleProviderCommon,
      "behavior": "domain",
      "url": "https://gh-proxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/geolocation-!cn.mrs",
      "path": "./rules/proxy-domain.mrs",
      "type": "http",
      "format": "mrs",
      "interval": 86400
    }
  }; */

  // 覆盖规则
/*   config["rules"] = [
    "DOMAIN,clash.razord.top,DIRECT",
    "DOMAIN,yacd.metacubex.one,DIRECT",
    "DOMAIN,yacd.haishan.me,DIRECT",
    "DOMAIN,d.metacubex.one,DIRECT",
    "DOMAIN,m.youtube.com,YouTube",
    "DOMAIN,board.zash.run.place,DIRECT",
    "RULE-SET,private-domain,DIRECT",
    "RULE-SET,youtube-domain,YouTube",
    "RULE-SET,tiktok-domain,TikTok",
    "RULE-SET,bahamut-domain,台湾",
    "RULE-SET,bilibili-domain,bilibili",
    "RULE-SET,wechat-classical,DIRECT",
    "PROCESS-NAME,com.ss.android.ugc.aweme,DIRECT",
    "PROCESS-NAME,com.radolyn.ayugram,Telegram",
    "PROCESS-NAME,xyz.nextalone.nagram,Telegram",
    "PROCESS-NAME,tv.danmaku.bili,bilibili",
    "PROCESS-NAME,com.baidu.input,DIRECT",
    "PROCESS-NAME,com.tencent.mm,DIRECT",
    "RULE-SET,telegram-domain,Telegram",
    "RULE-SET,github-domain,Proxy",
    "RULE-SET,twitter-domain,X",
    "RULE-SET,apple-classical,美国",
    "RULE-SET,proxy-domain,Proxy",
    "RULE-SET,telegram-ip,Telegram",
    "RULE-SET,twitter-ip,X",
    "RULE-SET,cn-domain,DIRECT",
    "RULE-SET,bilibili-ip,bilibili",
    "RULE-SET,private-ip,DIRECT",
    "GEOIP,cn,DIRECT",
    "MATCH,Final"
  ]; */

  // 返回修改后的配置
  return config;
}

const countryRegions = [
  { code: "HK", name: "香港", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/hk.svg", regex: /(香港|HK|Hong Kong|🇭🇰)(?!.*(中国|CN|China|PRC|🇨🇳))/i },
  { code: "TW", name: "台湾", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tw.svg", regex: /(台湾|TW|Taiwan|🇹🇼)(?!.*(中国|CN|China|PRC|🇨🇳))(?!.*Networks)/i },  
  { code: "SG", name: "新加坡", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/sg.svg", regex: /(新加坡|狮城|SG|Singapore|🇸🇬)/i },
  { code: "JP", name: "日本", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/jp.svg", regex: /(日本|JP|Japan|东京|🇯🇵)/i },
  { code: "US", name: "美国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/us.svg", regex: /^(?!.*(Plus|plus|custom)).*(美国|洛杉矶|US|USA|United States|America|🇺🇸)/i },
  { code: "CN", name: "中国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/cn.svg", regex: /^(?!.*(美国|洛杉矶|US|USA|新加坡|狮城|SG|日本|JP|韩国|KR|台湾|HK|香港|TW|CN_d)).*(中国|CN|China|PRC|🇨🇳)/i },
  { code: "DE", name: "德国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/de.svg", regex: /^(?!.*shadowsocks).*(德国|DE|Germany|🇩🇪)/i },
  { code: "KR", name: "韩国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/kr.svg", regex: /(韩国|首尔|KR|Korea|South Korea|🇰🇷)/i },
  { code: "UK", name: "英国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/gb.svg", regex: /(英国|UK|United Kingdom|Britain|Great Britain|🇬🇧)/i },
  { code: "CA", name: "加拿大", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ca.svg", regex: /^(?!.*(Anycast|Datacamp)).*(加拿大|CA|Canada|🇨🇦)/i },
  { code: "AU", name: "澳大利亚", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/au.svg", regex: /(澳大利亚|AU|Australia|🇦🇺)/i },
  { code: "FR", name: "法国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/fr.svg", regex: /^(?!.*(free|Frontier|Frankfurt)).*(法国|FR|France|🇫🇷)/i },
  { code: "NL", name: "荷兰", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/nl.svg", regex: /^(?!.*(only|online|MNL)).*(荷兰|NL|Netherlands|🇳🇱)/i },
  { code: "RU", name: "俄罗斯", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ru.svg", regex: /(俄罗斯|RU|Russia|🇷🇺)/i },
  { code: "IN", name: "印度", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/in.svg", regex: /^(?!.*(美国|洛杉矶|US|USA|新加坡|狮城|SG|日本|JP|韩国|KR|台湾|HK|香港|TW|CN_d|Singapore|Argentina|Intel|Inc|ing|link|business|hinet|internet|印度尼西亚|main)).*(印度|IN|India|🇮🇳)/i }, 
  { code: "BR", name: "巴西", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/br.svg", regex: /(巴西|BR|Brazil|🇧🇷)/i },
  { code: "IT", name: "意大利", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/it.svg", regex: /^(?!.*(mitce|reality|digital|leiting|limited|it7|territories)).*(意大利|IT|Italy|🇮🇹)/i },
  { code: "CH", name: "瑞士", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ch.svg", regex: /^(?!.*(incheon|chunghwa|tech|psychz|channel|seychelles|chuncheon)).*(瑞士|CH|Switzerland|🇨🇭)/i },
  { code: "SE", name: "瑞典", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/se.svg", regex: /^(?!.*(sel2|sea1|server|selfhost|neonpulse|base|seoul|seychelles)).*(瑞典|SE|Sweden|🇸🇪)/i },
  { code: "NO", name: "挪威", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/no.svg", regex: /^(?!.*(none|node|annoy|cf_no1|technolog)).*(挪威|NO|Norway|🇳🇴)/i },
  { code: "MY", name: "马来西亚", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/my.svg", regex: /^(?!.*(myshadow)).*(马来西亚|MY|Malaysia|🇲🇾)/i },
  { code: "VN", name: "越南", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/vn.svg", regex: /(越南|VN|Vietnam|🇻🇳)/i },
  { code: "PH", name: "菲律宾", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ph.svg", regex: /^(?!.*(phoenix|phx)).*(菲律宾|PH|Philippines|🇵🇭)/i },
  { code: "TH", name: "泰国", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/th.svg", regex: /^(?!.*(GTHost|pathx)).*(泰国|TH|Thailand|🇹🇭)/i },
  { code: "ID", name: "印度尼西亚", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/id.svg", regex: /(印度尼西亚|ID|Indonesia|🇮🇩)/i },
  { code: "AR", name: "阿根廷", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ar.svg", regex: /^(?!.*(warp|arm|flare|star|shar|par|akihabara|bavaria)).*(阿根廷|AR|Argentina|🇦🇷)/i },
  { code: "NG", name: "尼日利亚", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ng.svg", regex: /^(?!.*(ong|ing|angeles|ang|ung)).*(尼日利亚|NG|Nigeria|🇳🇬)(?!.*(Hongkong|Singapore))/i },
  { code: "TR", name: "土耳其", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tr.svg", regex: /^(?!.*(trojan|str|central)).*(土耳其|TR|Turkey|🇹🇷)/i },
  { code: "ES", name: "西班牙", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/es.svg", regex: /^(?!.*(vless|angeles|vmess|seychelles|business|ies|reston)).*(西班牙|ES|Spain|🇪🇸)/i },
  { code: "AT", name: "奥地利", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/at.svg", regex: /^(?!.*(Gate)).*(奥地利|AT|Austria|🇦🇹)/i },
  { code: "MX", name: "墨西哥", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/mx.svg", regex: /(墨西哥|MX|Mexico|🇲🇽)/i },
  { code: "EE", name: "爱沙尼亚", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ee.svg", regex: /^(?!.*(free)).*(爱沙尼亚|EE|Estonia|🇪🇪)/i },
  { code: "PL", name: "波兰", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/pl.svg", regex: /(波兰|PL|Poland|🇵🇱)/i },
  { code: "IR", name: "伊朗", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/ir.svg", regex: /(伊朗|IR|Iran|🇮🇷)/i },
  { code: "ZA", name: "南非", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/za.svg", regex: /(南非|ZA|South Africa|🇿🇦)/i },
  { code: "CO", name: "哥伦比亚", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/co.svg", regex: /(哥伦比亚|CO|Colombia|🇨🇴)/i },
  { code: "SA", name: "沙特阿拉伯", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/sa.svg", regex: /^(?!.*(usa|sakura)).*(沙特阿拉伯|沙特|SA|Saudi Arabia|🇸🇦)/i },
  { code: "CL", name: "智利", icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/cl.svg", regex: /^(?!.*(cloud)).*(智利|CL|Chile|🇨🇱)/i },
];

function getTestUrlForGroup(groupName) {
  switch (groupName) {
  case "Steam":
    return "https://store.steampowered.com/";
  case "YouTube":
    return "https://www.youtube.com/";
  case "Telegram":
    return "https://web.telegram.org/";
  case "X.com":
    return "https://x.com/";
  case "ChatGPT":
    return "https://chat.openai.com/";
  case "Claude":
    return "https://www.claude.ai/";
  case "Apple":
    return "https://www.apple.com/";
  case "iCloud":
    return "https://www.icloud.com/";
  case "Onedrive":
    return "https://onedrive.live.com/";
  case "Spotify":
    return "https://www.spotify.com/";
  case "Google":
    return "http://google.com/";
  case "Microsoft":
    return "http://msn.com/";
  case "Linux Do":
    return "https://linux.do/";
  case "Cursor":
    return "https://api2.cursor.sh/";
  case "Augment":
    return "https://augment.caicode.org/";
  default:
    return "http://www.gstatic.com/generate_204";
  }
};

function getIconForGroup(groupName) {
  switch (groupName) {
  case "Linux Do":
    return "https://linux.do/uploads/default/original/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994.png";
  case "Steam":
    return "https://fastly.jsdelivr.net/gh/Orz-3/mini@master/Color/Steam.png";
  case "Telegram":
    return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/telegram.png";
  case "X.com":
    return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/x.png";
  case "YouTube":
    return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/youtube.png";
  case "ChatGPT":
    return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/openai.png";
  case "Claude":
    return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/anthropic.png";
  case "Apple":
    return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/apple.png";
  case "Spotify":
    return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/spotify.png";
  case "Google":
    return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/google.png";
  case "Microsoft":
    return "https://fastly.jsdelivr.net/gh/shindgewongxj/WHATSINStash@master/icon/microsoft.png";
  case "OneDrive":
    return "https://testingcf.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/OneDrive.png";
  case "Cursor":
    return "https://fastly.jsdelivr.net/gh/yusnake/Rules@main/icons8-cursor-ai-240.svg";
  case "Augment":
    return "https://fastly.jsdelivr.net/gh/yusnake/Rules@main/augment.png";
  case "漏网之鱼":
    return "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg";
  case "广告拦截":
    return "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/block.svg";
  default:
    return "";
  }
};


const CODE_ALIAS = {
  UK: "GB",   // 英国
  // EU: "EU", // 没有 EU 国旗，别映射
  // 你还有其他自定义两字母也可在此列
};

function codeToFlag (cc) {
  const code = (CODE_ALIAS[cc] || cc).toUpperCase();
  return [...code]
  .map(ch => String.fromCodePoint(ch.charCodeAt(0) + 0x1f1e6 - 0x41))
  .join("");
};

function overwriteProxyGroups(params) {
  const allProxies = params["proxies"].map((e) => e.name);

  const availableCountryCodes = new Set();
  const otherProxies = [];
  for (const proxy of params["proxies"]) {
    let bestMatch = null;
    let longestMatchLength = 0;

    for (const region of countryRegions) {
      const match = proxy.name.match(region.regex);
      if (match) {
        if (match[0].length > longestMatchLength) {
          longestMatchLength = match[0].length;
          bestMatch = region.code;
        }
      }
    }

    if (bestMatch) {
      availableCountryCodes.add(bestMatch);
    } else {
      otherProxies.push(proxy.name);
    }
  }

  availableCountryCodes.add("CN");

  const autoProxyGroupRegexs = countryRegions
    .filter(region => availableCountryCodes.has(region.code))
    .map(region => ({
      name: `${codeToFlag(region.code)} ${region.code} - 自动选择`,
      regex: region.regex,
    }));

  const autoProxyGroups = autoProxyGroupRegexs
    .map((item) => ({
      name: item.name,
      type: "url-test",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 50,
      proxies: getProxiesByRegex(params, item.regex),
      hidden: true,
    }))
    .filter((item) => item.proxies.length > 0);

  const manualProxyGroupsConfig = countryRegions
    .filter(region => availableCountryCodes.has(region.code))
    .map(region => ({
      name: `${codeToFlag(region.code)} ${region.code} - 手动选择`,
      type: "select",
      proxies: getManualProxiesByRegex(params, region.regex),
      icon: region.icon,
      hidden: false,
    })).filter(item => item.proxies.length > 0);

  let otherManualProxyGroup = null;
  let otherAutoProxyGroup = null;

  if (otherProxies.length > 0) {
    otherManualProxyGroup = {
      name: "其它 - 手动选择",
      type: "select",
      proxies: otherProxies,
      icon: "https://www.clashverge.dev/assets/icons/guard.svg",
      hidden: true,
    };

    otherAutoProxyGroup = {
      name: "其它 - 自动选择",
      type: "url-test",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 50,
      proxies: otherProxies,
      hidden: true,
    };
  }
  const app_groups = ["Telegram",  "YouTube",  "ChatGPT",  "Claude",  "Google",  "X.com",  "Microsoft",  "OneDrive",  "Apple",  "Cursor",  "Augment",];
  
  const proxyName = "Proxy";

  const groups = [
    {
      name: proxyName,
      type: "select",
      url: "http://www.gstatic.com/generate_204",
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg",
      proxies: ["自动选择", "手动选择", "负载均衡 (散列)", "负载均衡 (轮询)", "DIRECT"],
    },

    {
      name: "手动选择",
      type: "select",
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg",
      proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
    },

    {
      name: "自动选择",
      type: "select",
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg",
      proxies: ["ALL - 自动选择", ...autoProxyGroups
        .filter(group => !app_groups.includes(group.name))
        .map(group => group.name), otherAutoProxyGroup ? otherAutoProxyGroup.name : null].filter(Boolean),
    },

    {
      name: "负载均衡 (散列)",
      type: "load-balance",
      url: "http://www.gstatic.com/generate_204",
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/balance.svg",
      interval: 300,
      "max-failed-times": 3,
      strategy: "consistent-hashing",
      lazy: true,
      proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
      hidden: true,
    },

    {
      name: "负载均衡 (轮询)",
      type: "load-balance",
      url: "http://www.gstatic.com/generate_204",
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/merry_go.svg",
      interval: 300,
      "max-failed-times": 3,
      strategy: "round-robin",
      lazy: true,
      proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
      hidden: true,
    },

    {
      name: "ALL - 自动选择",
      type: "url-test",
      url: "http://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 50,
      proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
      hidden: true,
    },

    ...app_groups.map(groupName => ({
      name: groupName,
      type: "select",
      url: getTestUrlForGroup(groupName),
      icon: getIconForGroup(groupName),
      proxies: [
        proxyName,
        "DIRECT",
        `ALL - 自动选择 - ${groupName}`, 
        ...countryRegions
          .filter(region => availableCountryCodes.has(region.code))
          .flatMap(region => [
            `${codeToFlag(region.code)} ${region.code} - 自动选择 - ${groupName}`, 
            `${codeToFlag(region.code)} ${region.code} - 手动选择`,
          ]),
        //otherAutoProxyGroup ? `${otherAutoProxyGroup.name} - ${groupName}` : null,
      ].filter(Boolean),
    })),

    {
      name: "漏网之鱼",
      type: "select",
      proxies: [proxyName, "DIRECT"],
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg",
      //hidden: true,
    },

    {
      name: "广告拦截",
      type: "select",
      proxies: ["REJECT", "DIRECT", proxyName],
      icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/block.svg",
      //hidden: true,
    },
  ];

  const websiteSpecificAutoGroups = app_groups.flatMap(groupName => {
    return [
      {
        name: `ALL - 自动选择 - ${groupName}`,
        type: "url-test",
        url: getTestUrlForGroup(groupName), 
        interval: 300,
        tolerance: 50,
        proxies: allProxies.length > 0 ? allProxies : ["DIRECT"],
        hidden: true,
      },
      ...autoProxyGroupRegexs.map(item => ({
        name: `${item.name} - ${groupName}`,
        type: "url-test",
        url: getTestUrlForGroup(groupName),
        interval: 300,
        tolerance: 50,
        proxies: getProxiesByRegex(params, item.regex),
        hidden: true,
      })).filter(item => item.proxies.length > 0),
      ...(otherAutoProxyGroup ? [{
        name: `${otherAutoProxyGroup.name} - ${groupName}`,
        type: "url-test",
        url: getTestUrlForGroup(groupName), 
        interval: 300,
        tolerance: 50,
        proxies: otherProxies,
        hidden: true,
      }] : []),
    ];
  });


  if (otherAutoProxyGroup) {
    autoProxyGroups.push(otherAutoProxyGroup);
  }

  groups.push(...autoProxyGroups);
  groups.push(...manualProxyGroupsConfig);
  if (otherManualProxyGroup) {
    groups.push(otherManualProxyGroup);
  }
  groups.push(...websiteSpecificAutoGroups); 
  params["proxy-groups"] = groups;
}

function getProxiesByRegex(params, regex) {
	const matchedProxies = params.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
	return matchedProxies.length > 0 ? matchedProxies : ["手动选择"];
}

function getManualProxiesByRegex(params, regex) {
	const matchedProxies = params.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
	return regex.test("CN") 
	? ["DIRECT", ...matchedProxies]
	: matchedProxies.length > 0 
	? matchedProxies 
	: ["DIRECT", "手动选择", proxyName];
}