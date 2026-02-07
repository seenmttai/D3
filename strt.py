import requests
import concurrent.futures
import time
import statistics
from urllib.parse import quote

# ------------------------------------------------------------------
# COURSE CONFIGURATION
# ------------------------------------------------------------------
DOMAIN = "https://quic.skirro.com"

# Extracted from your CSV (Excluding Day 4)
VIDEO_PATHS = [
    "MSC CA Industrial Training Program - 2025_12_17 20_50 GMT+05_30 – Recording", # Day 2
    "MSC CA Industrial Training Program - 2025_12_18 20_44 GMT+05_30 – Recording-003", # Day 3
    "MSC CA Industrial Training Program - 2025_12_20 20_53 GMT+05_30 – Recording", # Day 5
    "MSC CA Industrial Training Program - 2025_12_21 20_51 GMT+05_30 – Recording-001"  # Day 6
]

# CWND Settings
INITIAL_THREADS = 5
MIN_THREADS = 1
MAX_THREADS = 40 
STEP = 2          
PADDING = 3 # data001.ts

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://www.mystudentclub.com/",
    "Origin": "https://www.mystudentclub.com",
}

# ------------------------------------------------------------------

def warm_segment(url):
    try:
        start = time.perf_counter()
        with requests.get(url, headers=HEADERS, stream=True, timeout=15) as r:
            if r.status_code == 404: return 404, 0, "NONE"
            if r.status_code != 200: return r.status_code, 0, "NONE"
            
            for _ in r.iter_content(chunk_size=1024*1024): pass 
            
            duration = (time.perf_counter() - start) * 1000
            return 200, duration, r.headers.get("CF-Cache-Status", "NONE")
    except:
        return 0, 0, "NONE"

def warm_video(video_path):
    # Encode spaces and special characters for the URL
    encoded_path = quote(video_path)
    base_url = f"{DOMAIN}/{encoded_path}/stream_0/"
    
    current_threads = INITIAL_THREADS
    prev_avg_time = 0
    current_index = 1
    consecutive_404s = 0
    
    print(f"\n📺 WARMING VIDEO: {video_path}")
    print("-" * 80)
    print(f"{'BATCH':<10} | {'THREADS':<8} | {'AVG TIME':<10} | {'ACTION':<15} | {'CACHE'}")
    print("-" * 80)

    batch_num = 1
    while True:
        batch_durations = []
        batch_hits = 0

        with concurrent.futures.ThreadPoolExecutor(max_workers=current_threads) as executor:
            urls = [f"{base_url}data{i:0{PADDING}d}.ts" for i in range(current_index, current_index + current_threads)]
            futures = [executor.submit(warm_segment, url) for url in urls]
            current_index += current_threads

            for future in concurrent.futures.as_completed(futures):
                status, duration, cache = future.result()
                if status == 404:
                    consecutive_404s += 1
                else:
                    consecutive_404s = 0
                    batch_durations.append(duration)
                    if cache == "HIT": batch_hits += 1

        if consecutive_404s >= 5:
            print(f"✅ Finished Video (End reached)")
            break

        if not batch_durations: break

        avg_time = statistics.mean(batch_durations)
        hit_rate = (batch_hits / len(batch_durations)) * 100
        
        # CWND Pivot Logic
        action = "STABLE"
        if prev_avg_time > 0:
            if avg_time > (prev_avg_time * 1.05): # 5% threshold
                current_threads = min(current_threads + STEP, MAX_THREADS)
                action = f"INC (+{STEP})"
            elif avg_time < (prev_avg_time * 0.95):
                current_threads = max(current_threads - STEP, MIN_THREADS)
                action = f"DEC (-{STEP})"

        print(f"Batch #{batch_num:<5} | T: {current_threads:<6} | {avg_time:8.2f}ms | {action:<15} | {hit_rate:3.0f}% HIT")
        prev_avg_time = avg_time
        batch_num += 1

def main():
    print("🚀 Course Cache Warmer v2.0")
    print(f"Total Videos to process: {len(VIDEO_PATHS)}")
    
    start_time = time.time()
    for path in VIDEO_PATHS:
        warm_video(path)
    
    total_time = (time.time() - start_time) / 60
    print(f"\n✨ ALL VIDEOS WARMED in {total_time:.2f} minutes.")

if __name__ == "__main__":
    main()