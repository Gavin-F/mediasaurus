import requests
from babel import Locale

class JustWatch:
	def __init__(self, country='CA', **kwargs):
		self.kwargs = kwargs
		self.country = country
		print(self.country)
		self.language = Locale.parse('und_{}'.format(self.country)).language
		print(self.language)
	def search_for_item(self, **kwargs):
		if kwargs:
			self.kwargs = kwargs
		null = None
		payload = {
			"content_types":null,
			"presentation_types":null,
			"providers":null,
			"genres":null,
			"languages":null,
			"release_year_from":null,
			"release_year_until":null,
			"monetization_types":null,
			"min_price":null,
			"max_price":null,
			"scoring_filter_types":null,
			"cinema_release":null,
			"query":null
		}
		for key, value in self.kwargs.items():
			if key in payload.keys():
				payload[key] = value
			else:
				print('{} is not a valid keyword'.format(key))
		header = {'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36(KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36'}
		api_url = 'https://api.justwatch.com/titles/{}_{}/popular'.format(self.language, self.country)
		r = requests.post(api_url, json=payload, headers=header)
		return r.json()



just_watch = JustWatch()

results = just_watch.search_for_item(query='the matrix')

print(results)