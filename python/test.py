import sys
import json

param1 = sys.argv[1]
param2 = sys.argv[2]
# result = {"sum": int(param1) + int(param2)}
# print(json.dumps(result))
print(int(param1) + int(param2))
sys.stdout.flush()