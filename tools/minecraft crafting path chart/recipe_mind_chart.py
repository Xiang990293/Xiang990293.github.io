import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import os
import json

PATH = "minecraft crafting path chart/"
# lang = input("choose language(en_us/zh_tw): ")
lang = "zh_tw"

#first, we change the language from English to Chinese.
with open(PATH + f"lang/{lang}.json","r") as tw:
	tw = json.loads(tw.read())

	for item in os.listdir(PATH + "textures/item/"):
		item = "item.minecraft." + item[:-4]
		print(tw[item])
		# for translate in tw.read():
		# 	if(translate.find(item) != -1):
		# 		print(translate.find(item), translate.index(item))
	# with open(PATH + "lang/zh_tw.json","r", 'r') as f:
# 		for line in f.readlines():
# 			csv.write((re.sub("\\s+",",", line.strip())).replace(",","/",2) + "\n")
			

# with open(PATH+"sst_eastTaiwan_eqPacific.csv","r") as csv:
# 	sst = pd.read_csv(csv)
# 	print(sst)

# x1 = (sst['East_Taiwan']-sst['East_Taiwan'].mean())/sst['East_Taiwan'].std()
# x2 = (sst['Equatorial_Pacific']-sst['Equatorial_Pacific'].mean())/sst['Equatorial_Pacific'].std()
# plt.figure(figsize=(10, 6))
# plt.title("The box plot of SST at East Taiwan and Equatorial Pacific")
# plt.ylabel("normalized coordinate")
# plt.boxplot([x1,x2],sym = "x", labels= ["East Taiwan","Equatorial Pacific"])
# plt.show()