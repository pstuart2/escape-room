package cfg

type Config struct {
	gofigure interface{} `envPrefix:"ESCR" order:"flag,env"`
	Port     int         `env:"port" flag:"port" flagDesc:"Port to run the api server on"`
	Db       string      `env:"db" flag:"db" flagDesc:"Url to mongodb"`
}

func Load(getOverrides func(s interface{}) error) (Config, error) {
	config := getDefaults()

	err := getOverrides(&config)
	if err != nil {
		return config, err
	}

	return config, nil
}

func getDefaults() Config {
	return Config{
		Port: 3030,
		Db:   "mongodb://localhost:3001/meteor",
	}
}
