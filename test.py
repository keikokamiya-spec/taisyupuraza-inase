import google.generativeai as genai

# あなたのAPIキーをここに正確に入れてください
MY_KEY = "AIzaSyC_N_QUn3QeMsuGNRpOxiSlBTcFhVrGfQs" 

genai.configure(api_key=MY_KEY)

# 最新の「gemini-1.5-flash」を、より丁寧な名前で指定します
# 9行目をこれに変更（models/ をつけないのがコツ）
model = genai.GenerativeModel('gemini-pro-latest')

# 修正依頼をここに書く（世界一のWebデザイナーへの指示）
prompt = """
あなたは世界一のWebデザイナーです。
以下のテキストを、モバイル版（スマホ画面）で4行になってしまうところを、意味を損なわずに「3行以内」に収まるようリライト、またはレイアウト構成を提案してください。

【対象のテキスト】
創業以来、
継ぎ足しの煮汁で仕立てたこちらも人気メニュー。
その日のおすすめは、スタッフまで。

【デザイナーとしてのタスク】
1. モバイルで3行に収まる最適化されたテキスト案（2〜3パターン）
2. なぜその方がユーザーにとって読みやすいのか、プロの視点での解説
"""

# 実行して結果を表示
try:
    response = model.generate_content(prompt)
    print("\n--- Geminiデザイナーからの回答 ---\n")
    print(response.text)
except Exception as e:
    print(f"\nエラーが発生しました: {e}")