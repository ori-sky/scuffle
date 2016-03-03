module Scuffle {
	export module Protocol {
		export class Client {
			static Batch          =  1
			static Ping           =  5
			static Pong           =  6
			static StateOn        = 10
			static StateOff       = 11
			static MapGet         = 25
			static InstanceJoin   = 45
			static InstanceReady  = 46
			static InstanceMeLook = 75
		}
		export class Server {
			static Batch                  =  1
			static Ping                   =  5
			static Pong                   =  6
			static StateOn                = 10
			static StateOff               = 11
			static MapGet                 = 25
			static MapNotFound            = 26
			static InstanceJoin           = 43
			static InstanceNotFound       = 44
			static InstanceNone           = 45
			static InstanceIn             = 46
			static InstanceMapChange      = 55
			static InstancePlayerAdd      = 60
			static InstancePlayerRemove   = 61
			static InstancePlayerStateOn  = 62
			static InstancePlayerStateOff = 63
			static InstancePlayerSpawn    = 64
			static InstancePlayerMove     = 65
			static InstancePlayerHeal     = 67
			static InstancePlayerHurt     = 68
			static InstancePlayerKill     = 69
			static InstanceYou            = 70
			static InstanceBulletAdd      = 80
			static InstanceBulletRemove   = 81
			static InstanceBulletMove     = 85
			static InstanceBulletDilate   = 86
			static Reset                  = 92
			static Refresh                = 93
		}
	}
}
