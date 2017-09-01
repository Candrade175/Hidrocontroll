using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using hidrocontroll.Models;

using hidrocontroll.Areas.Functional;

namespace hidrocontroll.Controllers
{
    public class ManejoController : BaseController
    {

        // GET api/Manejo
        public IQueryable<REG_MANEJO> GetREG_MANEJO()
        {
            return db.REG_MANEJO;
        }

        // GET api/Manejo/5
        [ResponseType(typeof(REG_MANEJO))]
        public IHttpActionResult GetREG_MANEJO(int id)
        {
            REG_MANEJO reg_manejo = db.REG_MANEJO.Find(id);
            if (reg_manejo == null)
            {
                return NotFound();
            }

            return Ok(reg_manejo);
        }

        // PUT api/Manejo/5
        public IHttpActionResult PutREG_MANEJO(int id, REG_MANEJO reg_manejo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != reg_manejo.IDC_REG_MANEJO)
            {
                return BadRequest();
            }

            db.Entry(reg_manejo).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!REG_MANEJOExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/Manejo
        [ResponseType(typeof(REG_MANEJO))]
        public IHttpActionResult PostREG_MANEJO(REG_MANEJO reg_manejo)
        {
            if (!ModelState.IsValid)
            {

                return BadRequest(ModelState);

            }


            db.REG_MANEJO.Add(reg_manejo);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = reg_manejo.IDC_REG_MANEJO }, reg_manejo);
        }

        // DELETE api/Manejo/5
        [ResponseType(typeof(REG_MANEJO))]
        public IHttpActionResult DeleteREG_MANEJO(int id)
        {
            REG_MANEJO reg_manejo = db.REG_MANEJO.Find(id);
            if (reg_manejo == null)
            {
                return NotFound();
            }

            db.REG_MANEJO.Remove(reg_manejo);
            db.SaveChanges();

            return Ok(reg_manejo);
        }

        public void atualizaManejo(int idc_parcela, DateTime dataAtualizacao)
        {
            hidrocontrollEntities db = new hidrocontrollEntities();
            db.Configuration.ProxyCreationEnabled = false;

            CAD_PARCELA parcela = db.CAD_PARCELA.Include(c => c.CAD_PIVO_CENTRAL).Include(c => c.CAD_GOTEJADOR).Where(c2 => c2.IDC_CAD_PARCELA == idc_parcela).First();

            double necessariaInicial = 0;
            double ks = 0;
            double balanco = 0;
            double totalPivo = 0;
            int? contInicio = DateTimeFunctional.diferencaDeDias(dataAtualizacao, parcela.DAT_PLANTIO);
            int? contFim = DateTimeFunctional.diferencaDeDias(DateTime.Now, parcela.DAT_PLANTIO);
            int diaFinal = 0;


            CAD_PIVO_CENTRAL pivo = parcela.CAD_PIVO_CENTRAL;
            CAD_GOTEJADOR gotejador = parcela.CAD_GOTEJADOR;
            CAD_CULTURA cultura = db.CAD_CULTURA.Include(c => c.CAD_PARCELA).Include(c => c.CAD_FASE_CULTURA).Where(c2 => c2.IDC_CAD_CULTURA == parcela.CAD_CULTURA_IDC_CAD_CULTURA).First();
            CAD_FAZENDA fazenda = db.CAD_FAZENDA.Include(f => f.CAD_CULTURA).Include(f => f.CAD_CLIMA).Where(f2 => f2.IDC_CAD_FAZENDA == cultura.CAD_FAZENDA_IDC_CAD_FAZENDA).First();
            CAD_SOLO solo = db.CAD_SOLO.Where(s => s.IDC_CAD_SOLO == parcela.CAD_SOLO_IDC_CAD_SOLO).First();
            CAD_FASE_CULTURA faseCultura = null;




            if (parcela.CAD_PIVO_CENTRAL_IDC_CAD_PIVO_CENTRAL != null)
            {
                totalPivo = ((2 * Math.PI * (pivo.DIS_RAIO_TOTAL - pivo.VAR_VAO_BALANCO)) / pivo.VEL_100_PIVO).Value;
            }

            foreach (REG_MANEJO manejo in db.REG_MANEJO.Where(r => r.CAD_PARCELA_IDC_CAD_PARCELA == parcela.IDC_CAD_PARCELA))
            {
                if (dataAtualizacao.Date == manejo.DAT_MANEJO.Value.Date)
                {
                    ks = manejo.VAR_KS.Value;
                    balanco = manejo.VAR_BALANCO.Value;
                    break;
                }
            }

            bool primeiro = true;


            foreach (CAD_FASE_CULTURA fc in cultura.CAD_FASE_CULTURA)
            {
                if (primeiro)
                {
                    diaFinal = fc.NUM_FIM;
                    primeiro = false;
                }
                else
                {
                    if (fc.NUM_FIM > diaFinal)
                    {
                        diaFinal = fc.NUM_FIM;
                    }
                }
                if (fc.NUM_INICIO == 0)
                {
                    faseCultura = fc;
                }
            }

            if (contFim > diaFinal)
            {
                contFim = diaFinal;
            }
            if (contInicio < 0)
            {
                contInicio = null;
                contFim = null;

            }

            foreach (REG_MANEJO m in db.REG_MANEJO.Where(r => r.CAD_PARCELA_IDC_CAD_PARCELA == parcela.IDC_CAD_PARCELA))
            {
                if (m.DAT_MANEJO.Value.Date == dataAtualizacao.AddDays(-1).Date)
                {
                    ks = m.VAR_KS.Value;
                    balanco = m.VAR_BALANCO.Value;
                }

            }

            if (contInicio == 0)
            {
                necessariaInicial = (solo.VAR_CAPACIDADE_CAMPO.Value - parcela.VAR_UMIDADE_SOLO_PLANTIO.Value) / 100 * 1.05 * (faseCultura.PRF_RAIZ.Value * 10);
                ks = 0;
                balanco = 0;
            }
            while (contInicio <= contFim)
            {
                DateTime data = parcela.DAT_PLANTIO.AddDays(contInicio.Value);
                CAD_CLIMA clima = null;

                double temponecessario = 0;
                double percentimetro = 0;
                double extresseUltrapassado = 0;

                foreach (CAD_CLIMA c in fazenda.CAD_CLIMA)
                {
                    if (data.Date == c.DAT_CLIMA.Date)
                    {
                        clima = c;
                        break;
                    }
                }
                if (clima == null)
                {
                    clima = new CAD_CLIMA();
                    clima.TMP_CLIMA_MIN = 0;
                    clima.TMP_CLIMA_MAX = 0;
                    clima.TMP_CLIMA_MEDIA = 0;
                    clima.VAR_UMIDADE_RELATIVA = 0;
                    clima.VEL_VENTO = 0;
                    clima.VAR_RADIACAO = 0;
                    clima.VAR_PRECIPITACAO_TOTAL = 0;
                }

                CAD_PRECIPITACAO precipitacao = null;
                foreach (CAD_PRECIPITACAO p in db.CAD_PRECIPITACAO.Where(p => p.CAD_PARCELA_IDC_CAD_PARCELA == parcela.IDC_CAD_PARCELA))
                {
                    if (data.Date == p.DAT_PRECIPITACAO.Value.Date)
                    {
                        precipitacao = p;
                        break;
                    }
                }
                if (precipitacao == null)
                {
                    precipitacao = new CAD_PRECIPITACAO();
                    precipitacao.VAR_PRECIPITACAO = 0;
                }
                double chuva;
                if (precipitacao.VAR_PRECIPITACAO == 0)
                {
                    if (clima.VAR_PRECIPITACAO_TOTAL != null)
                    {
                        chuva = clima.VAR_PRECIPITACAO_TOTAL.Value;
                    }
                    else
                    {
                        chuva = 0;
                    }
                }
                else
                {
                    chuva = precipitacao.VAR_PRECIPITACAO.Value;
                }

                double e14 = 0.622;
                double e16 = 0.001013;
                double e18 = 2.45;
                double h20 = 0.0065 * fazenda.VAR_ALTITUDE.Value;
                double g20 = (293 - h20) / 293;
                double f20 = Math.Pow(g20, 5.26);
                double e20 = 101.3 * f20;
                double d17 = (e16 * e20) / (e14 * e18);
                double d23 = 1 + (0.34 * clima.VEL_VENTO.Value);
                double h31 = 17.27 * clima.TMP_CLIMA_MAX.Value;
                double h33 = clima.TMP_CLIMA_MAX.Value + 237.3;
                double g33 = h31 / h33;
                double f33 = Math.Exp(g33);
                double e33 = 0.6108 * f33;
                double h36 = 17.27 * clima.TMP_CLIMA_MIN.Value;
                double h38 = clima.TMP_CLIMA_MIN.Value + 237.3;
                double g36 = h36 / h38;
                double f36 = Math.Exp(g36);
                double e36 = 0.6108 * f36;
                double f45 = 17.27 * clima.TMP_CLIMA_MEDIA.Value;
                double f47 = clima.TMP_CLIMA_MIN.Value + 237.3;
                double e46 = Math.Exp(f45 / f47);
                double d35 = (e36 + e33) / 2;
                double d38 = (clima.VAR_UMIDADE_RELATIVA.Value / 100) * d35;
                double d42 = clima.VAR_RADIACAO.Value * 0.0864;
                double d46 = 0.6108 * e46;
                double d51 = Math.Pow((clima.TMP_CLIMA_MEDIA.Value + 237.3), 2);
                double c19 = d17 * d23;
                double c28 = 900 / (clima.TMP_CLIMA_MIN.Value + 273);
                double c37 = d35 - d38;
                double c42 = d42;
                double c45 = (4098 * d46) / d51;
                double b19 = c45 + c19;
                double b30 = d17 * c28 * clima.VEL_VENTO.Value * c37;
                double b44 = 0.408 * c45 * c42;
                double eto = (b44 + b30) / b19;

                CAD_IRRIGACAO irrigacao = null;
                foreach (CAD_IRRIGACAO i in db.CAD_IRRIGACAO.Where(i => i.CAD_PARCELA_IDC_CAD_PARCELA == parcela.IDC_CAD_PARCELA))
                {
                    if (data.Date == i.DAT_IRRIGACAO.Date)
                    {
                        irrigacao = i;
                        break;
                    }
                }
                if (irrigacao == null)
                {
                    irrigacao = new CAD_IRRIGACAO();
                    irrigacao.VOL_IRRIGACAO = 0;
                    irrigacao.TMO_IRRIGACAO_GOTEJO = 0;
                    irrigacao.TMO_IRRIGACAO_PIVO = 0;
                }

                foreach (CAD_FASE_CULTURA fc in cultura.CAD_FASE_CULTURA)
                {
                    if (fc.NUM_INICIO >= contInicio && fc.NUM_FIM <= contInicio)
                    {
                        faseCultura = fc;
                    }
                }

                double kl = faseCultura.ARE_SOMBREADA.Value;
                double etc = faseCultura.VAR_KC.Value * kl * eto * ks;
                double balancoHidrico = etc - irrigacao.VOL_IRRIGACAO.Value - chuva + necessariaInicial;
                necessariaInicial = 0;
                double irrigacaoDesnecessaria = balanco + etc - irrigacao.VOL_IRRIGACAO.Value + (solo.VAR_LIMITE.Value * -1);
                double? necessaria = null;

                if (irrigacaoDesnecessaria > 0)
                {
                    irrigacaoDesnecessaria = 0;
                }

                if (balancoHidrico + balanco < solo.VAR_LIMITE)
                {
                    balanco = solo.VAR_LIMITE.Value;
                }
                if (balanco < 0)
                {
                    necessaria = 0;
                }
                else
                {
                    necessaria = balanco;
                }

                ks = (Math.Log10((((((solo.VAR_CAPACIDADE_CAMPO.Value - solo.VAR_PONTO_MURCHA.Value) / 100) * solo.DEN_APARENTE.Value) *
                    (faseCultura.PRF_RAIZ.Value * 10)) - necessaria.Value) + 1)) / (Math.Log10(((((solo.VAR_CAPACIDADE_CAMPO.Value - solo.VAR_PONTO_MURCHA.Value) / 100)
                    * solo.DEN_APARENTE.Value) * (faseCultura.PRF_RAIZ.Value * 10)) + 1));

                if (ks < 0.01)
                {
                    ks = 0.01;
                }

                if (pivo != null)
                {
                    if (necessaria.Value != 0)
                    {
                        percentimetro = (100 * pivo.VAR_LAMINA.Value) / necessaria.Value;
                        temponecessario = (100 * totalPivo) / percentimetro;
                    }
                    else
                    {
                        percentimetro = 0;
                        temponecessario = 0;
                    }
                }
                if (gotejador != null)
                {
                    temponecessario = (60 * necessaria.Value) / gotejador.VAR_LAMINA.Value;
                }

                if (necessaria > parcela.VAR_ESTRESSE_EXCEDIDO)
                {
                    extresseUltrapassado = 1;
                }

                REG_MANEJO manejo = null;
                foreach (REG_MANEJO m in db.REG_MANEJO.Where(m => m.CAD_PARCELA_IDC_CAD_PARCELA == parcela.IDC_CAD_PARCELA))
                {
                    if (m.DAT_MANEJO.Value.Date == data.Date)
                    {
                        manejo = m;
                        break;
                    }
                }
                if (manejo == null)
                {
                    manejo = new REG_MANEJO();
                    manejo.CAD_PARCELA_IDC_CAD_PARCELA = parcela.IDC_CAD_PARCELA;
                    manejo.DAT_MANEJO = data;
                    manejo.IDC_REG_MANEJO = contInicio.Value;
                    try
                    {
                        REG_MANEJO r = atualizaDadosManejo(manejo, necessaria, irrigacao.VOL_IRRIGACAO, irrigacaoDesnecessaria, temponecessario, percentimetro, etc, ks, balanco, eto, faseCultura.VAR_KC, kl, chuva, irrigacao.TMO_IRRIGACAO_GOTEJO, irrigacao.TMO_IRRIGACAO_PIVO, extresseUltrapassado);
                        PostREG_MANEJO(r);
                    }
                    catch (Exception e)
                    {

                    }
                }
                else
                {
                    PutREG_MANEJO(manejo.IDC_REG_MANEJO, atualizaDadosManejo(manejo, necessaria, irrigacao.VOL_IRRIGACAO, irrigacaoDesnecessaria, temponecessario, percentimetro, etc, ks, balanco, eto, faseCultura.VAR_KC, kl, chuva, irrigacao.TMO_IRRIGACAO_GOTEJO, irrigacao.TMO_IRRIGACAO_PIVO, extresseUltrapassado));
                }

                contInicio += 1;

            }
        }

        private REG_MANEJO atualizaDadosManejo(REG_MANEJO manejo, double? necessaria, double? VOL_IRRIGACAO, double irrigacaoDesnecessaria, double temponecessario, double percentimetro, double etc, double ks, double balanco,
            double eto, double? kc, double kl, double chuva, double? TMO_IRRIGACAO_GOTEJO, double? TMO_IRRIGACAO_PIVO, double? extresseUltrapassado)
        {

            manejo.VOL_IRRIGACAO_NECESSARIA = necessaria;
            manejo.VOL_IRRIGACAO_REALIZADA = VOL_IRRIGACAO;
            manejo.VOL_IRRIGACAO_DESNECESSARIA = irrigacaoDesnecessaria;
            manejo.TMO_MANEJO = temponecessario;
            manejo.PER_PERCENTIMETRO = percentimetro;
            manejo.VOL_CONSUMO_DIARIO = etc;
            manejo.VAR_KS = ks;
            manejo.VAR_BALANCO = balanco;
            manejo.VAR_ETO = eto;
            manejo.VAR_KC = kc;
            manejo.VAR_KL = kl;
            manejo.VAR_PRECIPITACAO = chuva;
            manejo.TMO_IRRIGADO_GOTEJO = TMO_IRRIGACAO_GOTEJO;
            manejo.TMO_IRRIGADO_PIVO = TMO_IRRIGACAO_PIVO;
            manejo.VAR_EXTRESSE_ULTRAPASSADO = extresseUltrapassado;

            return manejo;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool REG_MANEJOExists(int id)
        {
            return db.REG_MANEJO.Count(e => e.IDC_REG_MANEJO == id) > 0;
        }


    }
}